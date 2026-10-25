require("dotenv").config({ path: "../.env" });
const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");
const pool = require("../db");

const dataDir = path.resolve(__dirname, "../../data/vehicles");
function csv(name) {
  return parse(fs.readFileSync(path.join(dataDir, name), "utf8"), {
    columns: true, skip_empty_lines: true, bom: true, relax_quotes: true
  });
}
function val(value) { return value === undefined || value === "" ? null : value; }
function num(value) { return val(value) === null ? null : Number(value); }
function bool(value) { return val(value) === null ? null : value.toLowerCase() === "true"; }
async function main() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const r of csv("ev_sources.csv")) {
      await client.query(`INSERT INTO vehicle_data_sources
        (source_id,source_url,source_organization,source_type,accessed_at,publication_date,supports)
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        ON CONFLICT(source_id) DO UPDATE SET source_url=EXCLUDED.source_url,
        source_organization=EXCLUDED.source_organization,source_type=EXCLUDED.source_type,
        accessed_at=EXCLUDED.accessed_at,publication_date=EXCLUDED.publication_date,supports=EXCLUDED.supports`,
      [num(r.source_id),r.source_url,r.source_organization,r.source_type,val(r.accessed_at),val(r.publication_date),val(r.supports)]);
    }
    for (const r of csv("ref_manufacturers.csv")) {
      await client.query(`INSERT INTO vehicle_manufacturers(manufacturer_id,manufacturer_name,country_of_origin)
        VALUES($1,$2,$3) ON CONFLICT(manufacturer_id) DO UPDATE SET
        manufacturer_name=EXCLUDED.manufacturer_name,country_of_origin=EXCLUDED.country_of_origin`,
      [num(r.manufacturer_id),r.manufacturer_name,val(r.country_of_origin)]);
    }
    for (const r of csv("ref_vehicle_models.csv")) {
      await client.query(`INSERT INTO vehicle_models(vehicle_model_id,manufacturer_id,model_name,vehicle_category,body_type,market_status)
        VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT(vehicle_model_id) DO UPDATE SET
        manufacturer_id=EXCLUDED.manufacturer_id,model_name=EXCLUDED.model_name,vehicle_category=EXCLUDED.vehicle_category,
        body_type=EXCLUDED.body_type,market_status=EXCLUDED.market_status`,
      [num(r.vehicle_model_id),num(r.manufacturer_id),r.model_name,val(r.vehicle_category),val(r.body_type),val(r.market_status)]);
    }
    for (const r of csv("ev_vehicle_database.csv")) {
      await client.query(`INSERT INTO vehicle_variants
        (variant_id,vehicle_model_id,variant_name,model_year_start,model_year_end,battery_capacity_kwh,battery_capacity_type,
         ac_charging_support,dc_charging_support,ac_connector_type,dc_connector_type,max_ac_power_kw,max_dc_power_kw,
         nominal_voltage_v,charging_port_config,spec_source_id,specification_source_url,source_type,
         specification_verification_status,last_verified_date,notes)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
        ON CONFLICT(variant_id) DO UPDATE SET vehicle_model_id=EXCLUDED.vehicle_model_id,variant_name=EXCLUDED.variant_name,
        model_year_start=EXCLUDED.model_year_start,model_year_end=EXCLUDED.model_year_end,battery_capacity_kwh=EXCLUDED.battery_capacity_kwh,
        battery_capacity_type=EXCLUDED.battery_capacity_type,ac_charging_support=EXCLUDED.ac_charging_support,
        dc_charging_support=EXCLUDED.dc_charging_support,ac_connector_type=EXCLUDED.ac_connector_type,dc_connector_type=EXCLUDED.dc_connector_type,
        max_ac_power_kw=EXCLUDED.max_ac_power_kw,max_dc_power_kw=EXCLUDED.max_dc_power_kw,nominal_voltage_v=EXCLUDED.nominal_voltage_v,
        charging_port_config=EXCLUDED.charging_port_config,spec_source_id=EXCLUDED.spec_source_id,
        specification_source_url=EXCLUDED.specification_source_url,source_type=EXCLUDED.source_type,
        specification_verification_status=EXCLUDED.specification_verification_status,last_verified_date=EXCLUDED.last_verified_date,notes=EXCLUDED.notes`,
      [num(r.variant_id),num(r.vehicle_model_id),r.variant_name,num(r.model_year_start),num(r.model_year_end),num(r.battery_capacity_kwh),
       val(r.battery_capacity_type),bool(r.ac_charging_support),bool(r.dc_charging_support),val(r.ac_connector_type),val(r.dc_connector_type),
       num(r.max_ac_power_kw),num(r.max_dc_power_kw),num(r.nominal_voltage_v),val(r.charging_port_config),num(r.spec_source_id),
       val(r.specification_source_url),val(r.source_type),val(r.specification_verification_status),val(r.last_verified_date),val(r.notes)]);
    }
    for (const r of csv("ev_connector_standards.csv")) {
      await client.query(`INSERT INTO vehicle_connector_standards
        (connector_id,connector_name,charging_mode,standard_description,reference_source_id,notes)
        VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT(connector_id) DO UPDATE SET connector_name=EXCLUDED.connector_name,
        charging_mode=EXCLUDED.charging_mode,standard_description=EXCLUDED.standard_description,
        reference_source_id=EXCLUDED.reference_source_id,notes=EXCLUDED.notes`,
      [num(r.connector_id),r.connector_name,r.charging_mode,val(r.standard_description),num(r.reference_source_id),val(r.notes)]);
    }
    for (const r of csv("ev_charging_compatibility.csv")) {
      await client.query(`INSERT INTO vehicle_charging_compatibility
        (support_id,variant_id,connector_id,charging_mode,max_supported_power_kw,compatibility_status,source_id,evidence_source_url,verification_status,technical_notes)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT(support_id) DO UPDATE SET
        variant_id=EXCLUDED.variant_id,connector_id=EXCLUDED.connector_id,charging_mode=EXCLUDED.charging_mode,
        max_supported_power_kw=EXCLUDED.max_supported_power_kw,compatibility_status=EXCLUDED.compatibility_status,
        source_id=EXCLUDED.source_id,evidence_source_url=EXCLUDED.evidence_source_url,
        verification_status=EXCLUDED.verification_status,technical_notes=EXCLUDED.technical_notes`,
      [num(r.support_id),num(r.variant_id),num(r.connector_id),r.charging_mode,num(r.max_supported_power_kw),
       val(r.compatibility_status),num(r.source_id),val(r.evidence_source_url),val(r.verification_status),val(r.technical_notes)]);
    }
    await client.query("COMMIT");
    const counts = await client.query(`SELECT
      (SELECT COUNT(*)::int FROM vehicle_manufacturers) manufacturers,
      (SELECT COUNT(*)::int FROM vehicle_models) models,
      (SELECT COUNT(*)::int FROM vehicle_variants) variants,
      (SELECT COUNT(*)::int FROM vehicle_charging_compatibility) compatibility`);
    console.log("Vehicle catalogue import complete:", counts.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Vehicle catalogue import failed:", error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}
main();
