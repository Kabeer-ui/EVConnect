#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
const { parse } = require("csv-parse/sync");
require("dotenv").config({ path: path.resolve(process.cwd(), ".env") });

const csvPath = path.resolve(process.argv[2] || "ev_india_enriched.csv");

if (!fs.existsSync(csvPath)) {
  console.error("CSV not found:", csvPath);
  console.error("Place ev_india_enriched.csv in the project root.");
  process.exit(1);
}

const e = process.env;

const pool = new Pool({
  host: process.env.PGHOST || "localhost",
  port: Number(process.env.PGPORT || 5432),
  database: process.env.PGDATABASE || "evconnect_db",
  user: process.env.PGUSER || "kabeer",
  password: process.env.PGPASSWORD,
});


const clean = v => v == null || String(v).trim() === "" ? null : String(v).trim();
const num = v => clean(v) === null || !Number.isFinite(Number(v)) ? null : Number(v);

function amountAndUnit(raw, type) {
  const s = clean(raw);
  if (!s) return { amount: null, unit: null };
  if (/^free$/i.test(s)) return { amount: 0, unit: "free" };

  const m = s.replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
  if (!m) return { amount: null, unit: s };

  const lower = s.toLowerCase();
  let unit = "unspecified";
  if (type === "price" && lower.includes("/kwh")) unit = "INR/kWh";
  else if (lower.includes("/hr") || lower.includes("/hour")) unit = "INR/hour";
  else if (lower.includes("/day")) unit = "INR/day";
  else if (lower.includes("/min")) unit = "INR/min";
  else if (lower.includes("/visit")) unit = "INR/visit";

  return { amount: Number(m[1]), unit };
}

function verifiedDate(raw) {
  const s = clean(raw);
  if (!s) return null;
  const d = new Date(`${s} 1`);
  if (Number.isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}

function validIndiaCoordinates(lat, lon) {
  return lat !== null && lon !== null &&
    lat >= 6 && lat <= 38.5 && lon >= 68 && lon <= 98;
}

async function main() {
  const rows = parse(fs.readFileSync(csvPath, "utf8"), {
    columns: true, skip_empty_lines: true, bom: true, trim: true
  });

  const client = await pool.connect();
  let inserted = 0, updated = 0, skipped = 0, connectorRows = 0;

  try {
    await client.query("BEGIN");

    await client.query(`
      ALTER TABLE public.charging_stations
        ADD COLUMN IF NOT EXISTS ev_charging_price_unit TEXT,
        ADD COLUMN IF NOT EXISTS parking_fee_unit TEXT
    `);

    for (const r of rows) {
      const sourceId = clean(r.station_id);
      const name = clean(r.station_name);
      const lat = num(r.latitude);
      const lon = num(r.longitude);

      if (!sourceId || !name || !validIndiaCoordinates(lat, lon)) {
        skipped++;
        continue;
      }

      const price = amountAndUnit(r.ev_charging_price, "price");
      const parking = amountAndUnit(r.parking_fee, "parking");
      const rating = num(r.user_rating);
      const safeRating = rating !== null && rating >= 0 && rating <= 5 ? rating : null;

      const values = [
        sourceId, name, clean(r.address), lat, lon,
        clean(r.operator_name), clean(r.state), clean(r.city),
        clean(r.access_type), clean(r.operating_hours),
        clean(r.operational_status), price.amount, price.unit,
        parking.amount, parking.unit, safeRating,
        clean(r.data_source), verifiedDate(r.data_last_verified)
      ];

      const existing = await client.query(
        "SELECT id FROM public.charging_stations WHERE source_station_id = $1",
        [sourceId]
      );

      let stationId;

      if (existing.rowCount) {
        const result = await client.query(`
          UPDATE public.charging_stations SET
            name=$2, address=$3, latitude=$4, longitude=$5,
            operator_name=$6, state=$7, city=$8, access_type=$9,
            operating_hours=$10, operational_status=$11,
            ev_charging_price=$12, ev_charging_price_unit=$13,
            parking_fee=$14, parking_fee_unit=$15, user_rating=$16,
            data_source=$17, data_last_verified=$18
          WHERE source_station_id=$1
          RETURNING id
        `, values);
        stationId = result.rows[0].id;
        updated++;
      } else {
        // Keep imported source IDs separate from existing OCM IDs.
        const suffix = sourceId.match(/(\d+)$/);
        let ocmId = suffix ? -Number(suffix[1]) : null;
        if (!ocmId) throw new Error(`Cannot derive internal import ID for ${sourceId}`);

        while ((await client.query(
          "SELECT 1 FROM public.charging_stations WHERE ocm_id=$1", [ocmId]
        )).rowCount) {
          ocmId -= 2000;
        }

        
const result = await client.query(`
  INSERT INTO public.charging_stations (
    ocm_id, name, address, latitude, longitude, source_station_id,
    operator_name, state, city, access_type, operating_hours,
    operational_status, ev_charging_price, ev_charging_price_unit,
    parking_fee, parking_fee_unit, user_rating, data_source,
    data_last_verified
  ) VALUES (
    $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
    $11,$12,$13,$14,$15,$16,$17,$18,$19
  )
  RETURNING id
`, [
  ocmId, ...values.slice(1, 5), values[0], ...values.slice(5)
]);

        stationId = result.rows[0].id;
        inserted++;
      }

      // Replace connector rows only for this imported station.
      await client.query("DELETE FROM public.connectors WHERE station_id=$1", [stationId]);

      const types = [...new Set((clean(r.connector_types) || "")
        .split(",").map(x => x.trim()).filter(Boolean))];

      for (const type of types) {
        await client.query(`
          INSERT INTO public.connectors
            (station_id, connector_type, connector_count, charger_category,
             bharat_standard, charger_grade)
          VALUES ($1,$2,NULL,$3,$4,$3)
        `, [
          stationId, type, clean(r.charger_category), clean(r.bharat_standard)
        ]);
        connectorRows++;
      }
    }

    await client.query("COMMIT");
    console.log("Import completed.");
    console.log("CSV rows:", rows.length);
    console.log("Stations inserted:", inserted);
    console.log("Stations updated:", updated);
    console.log("Rows skipped for missing/invalid IDs or coordinates:", skipped);
    console.log("Connector rows inserted:", connectorRows);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Import failed; transaction rolled back:", err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
