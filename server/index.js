
require("dotenv").config({ path: "../.env" });

const express = require("express");
const cors = require("cors");
const pool = require("./db");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 5000;

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("EVConnect backend is running");
});

app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS database_time");

    res.json({
      status: "ok",
      message: "EVConnect backend is running",
      database: "connected",
      databaseTime: result.rows[0].database_time,
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    res.status(500).json({
      status: "error",
      message: "Backend is running, but database connection failed",
    });
  }
});

app.get("/api/stations/preview", async (req, res) => {
  try {
    const apiKey = process.env.OPEN_CHARGE_MAP_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "Open Charge Map API key is missing from .env",
      });
    }

    const url = new URL("https://api.openchargemap.io/v3/poi/");
    url.search = new URLSearchParams({
      output: "json",
      countrycode: "IN",
      maxresults: "20",
      compact: "true",
      verbose: "false",
      key: apiKey,
    }).toString();

    const response = await fetch(url, {
      headers: { "User-Agent": "EVConnect-Student-Project/1.0" },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Open Charge Map request failed",
        status: response.status,
      });
    }

    const data = await response.json();

    const stations = data.map((item) => ({
      ocmId: item.ID,
      name: item.AddressInfo?.Title || "Unnamed charging station",
      address: [
        item.AddressInfo?.AddressLine1,
        item.AddressInfo?.Town,
        item.AddressInfo?.StateOrProvince,
      ].filter(Boolean).join(", "),
      latitude: item.AddressInfo?.Latitude,
      longitude: item.AddressInfo?.Longitude,
      connections: (item.Connections || []).map((c) => ({
        type: c.ConnectionType?.Title || "Unknown",
        powerKW: c.PowerKW ?? null,
      })),
    }));

    res.json({ source: "Open Charge Map", country: "India", count: stations.length, stations });
  } catch (error) {
    console.error("Open Charge Map error:", error.message);
    res.status(502).json({ error: "Could not retrieve station data" });
  }
});

app.post("/api/stations/import", async (req, res) => {
  const client = await pool.connect();

  try {
    const apiKey = process.env.OPEN_CHARGE_MAP_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "Open Charge Map API key is missing",
      });
    }

    const url = new URL("https://api.openchargemap.io/v3/poi/");
    url.search = new URLSearchParams({
      output: "json",
      countrycode: "IN",
      maxresults: "100",
      compact: "true",
      verbose: "false",
      key: apiKey,
    }).toString();

    const response = await fetch(url, {
      headers: {
        "User-Agent": "EVConnect-Student-Project/1.0",
      },
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      return res.status(502).json({
        error: "Open Charge Map request failed",
        status: response.status,
      });
    }

    const data = await response.json();
    let imported = 0;
    let skipped = 0;

    await client.query("BEGIN");

    for (const item of data) {
      const info = item.AddressInfo;

      if (
        !item.ID ||
        info?.Latitude == null ||
        info?.Longitude == null
      ) {
        skipped++;
        continue;
      }

      const name = info.Title || "Unnamed charging station";
      const address = [
        info.AddressLine1,
        info.Town,
        info.StateOrProvince,
      ].filter(Boolean).join(", ");

      const result = await client.query(
        `INSERT INTO charging_stations
          (ocm_id, name, address, latitude, longitude)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (ocm_id) DO UPDATE SET
           name = EXCLUDED.name,
           address = EXCLUDED.address,
           latitude = EXCLUDED.latitude,
           longitude = EXCLUDED.longitude
         RETURNING id`,
        [
          item.ID,
          name,
          address,
          info.Latitude,
          info.Longitude,
        ]
      );

      const stationId = result.rows[0].id;

      // Refresh connectors so repeated imports don't duplicate them.
      await client.query(
        "DELETE FROM connectors WHERE station_id = $1",
        [stationId]
      );

      for (const connection of item.Connections || []) {
        await client.query(
          `INSERT INTO connectors
            (station_id, connector_type, power_kw)
           VALUES ($1, $2, $3)`,
          [
            stationId,
            connection.ConnectionType?.Title || "Unknown",
            connection.PowerKW ?? null,
          ]
        );
      }

      imported++;
    }

    await client.query("COMMIT");

    const count = await pool.query(
      "SELECT COUNT(*)::int AS total FROM charging_stations"
    );

    res.json({
      source: "Open Charge Map",
      recordsReceived: data.length,
      stationsProcessed: imported,
      recordsSkipped: skipped,
      totalStationsInDatabase: count.rows[0].total,
    });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("Station import failed:", error.message);
    res.status(500).json({
      error: "Station import failed",
      details: error.message,
    });
  } finally {
    client.release();
  }
});

app.get("/api/stations", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        s.id,
        s.ocm_id AS "ocmId",
        s.name,
        s.address,
        s.source_station_id AS "sourceStationId",
        s.operator_name AS "operatorName",
        s.state,
        s.city,
        s.access_type AS "accessType",
        s.operating_hours AS "operatingHours",
        s.operational_status AS "operationalStatus",
        s.ev_charging_price AS "evChargingPrice",
        s.ev_charging_price_unit AS "evChargingPriceUnit",
        s.parking_fee AS "parkingFee",
        s.parking_fee_unit AS "parkingFeeUnit",
        s.user_rating AS "userRating",
        s.data_source AS "dataSource",
        s.data_last_verified AS "dataLastVerified",
        s.latitude,
        s.longitude,
        COALESCE(
          json_agg(
            json_build_object(
              'type', c.connector_type,
              'powerKW', c.power_kw
            )
          ) FILTER (WHERE c.id IS NOT NULL),
          '[]'::json
        ) AS connectors
      FROM charging_stations s
      LEFT JOIN connectors c ON c.station_id = s.id
      GROUP BY s.id
      ORDER BY s.name;
    `);

    res.json({
      count: result.rows.length,
      stations: result.rows,
    });
  } catch (error) {
    console.error("Failed to fetch stations:", error.message);
    res.status(500).json({
      error: "Failed to fetch charging stations",
    });
  }
});



app.get("/api/vehicles/manufacturers", async (req, res) => {
  try {
    const result = await pool.query(`SELECT manufacturer_id AS "manufacturerId",
      manufacturer_name AS "manufacturerName", country_of_origin AS "countryOfOrigin"
      FROM vehicle_manufacturers ORDER BY manufacturer_name`);
    res.json(result.rows);
  } catch (error) {
    console.error("Vehicle manufacturers query failed:", error.message);
    res.status(500).json({ error: "Vehicle catalogue is not initialized. Run the vehicle schema and importer." });
  }
});

app.get("/api/vehicles/models", async (req, res) => {
  const manufacturerId = Number(req.query.manufacturerId);
  if (!Number.isInteger(manufacturerId) || manufacturerId <= 0) return res.status(400).json({ error: "A valid manufacturerId is required." });
  try {
    const result = await pool.query(`SELECT vehicle_model_id AS "vehicleModelId", manufacturer_id AS "manufacturerId",
      model_name AS "modelName", vehicle_category AS "vehicleCategory", body_type AS "bodyType", market_status AS "marketStatus"
      FROM vehicle_models WHERE manufacturer_id = $1 ORDER BY model_name`, [manufacturerId]);
    res.json(result.rows);
  } catch (error) {
    console.error("Vehicle models query failed:", error.message);
    res.status(500).json({ error: "Vehicle catalogue is not initialized." });
  }
});

app.get("/api/vehicles/variants", async (req, res) => {
  const modelId = Number(req.query.modelId);
  if (!Number.isInteger(modelId) || modelId <= 0) return res.status(400).json({ error: "A valid modelId is required." });
  try {
    const result = await pool.query(`SELECT variant_id AS "variantId", vehicle_model_id AS "vehicleModelId",
      variant_name AS "variantName", model_year_start AS "modelYearStart", model_year_end AS "modelYearEnd",
      battery_capacity_kwh AS "batteryCapacityKwh", battery_capacity_type AS "batteryCapacityType",
      ac_connector_type AS "acConnectorType", dc_connector_type AS "dcConnectorType",
      max_ac_power_kw AS "maxAcPowerKw", max_dc_power_kw AS "maxDcPowerKw",
      specification_verification_status AS "verificationStatus", notes
      FROM vehicle_variants WHERE vehicle_model_id = $1 ORDER BY variant_id`, [modelId]);
    res.json(result.rows.map(row => ({
      ...row,
      batteryCapacityKwh: row.batteryCapacityKwh === null ? null : Number(row.batteryCapacityKwh),
      maxAcPowerKw: row.maxAcPowerKw === null ? null : Number(row.maxAcPowerKw),
      maxDcPowerKw: row.maxDcPowerKw === null ? null : Number(row.maxDcPowerKw),
    })));
  } catch (error) {
    console.error("Vehicle variants query failed:", error.message);
    res.status(500).json({ error: "Vehicle catalogue is not initialized." });
  }
});


app.post("/api/register", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (
    typeof fullName !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    !fullName.trim() ||
    !email.trim() ||
    password.length < 8
  ) {
    return res.status(400).json({
      error: "Name and email are required; password must be at least 8 characters."
    });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();

    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [normalizedEmail]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        error: "An account with this email already exists."
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO users (full_name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, full_name, email, created_at`,
      [fullName.trim(), normalizedEmail, passwordHash]
    );

    const user = result.rows[0];

    return res.status(201).json({
      message: "Registration successful",
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        error: "An account with this email already exists."
      });
    }

    console.error("Registration failed:", error.message);
    return res.status(500).json({ error: "Registration failed." });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password
  ) {
    return res.status(400).json({
      error: "Email and password are required."
    });
  }

  try {
    const result = await pool.query(
      `SELECT id, full_name, email, password_hash, created_at
       FROM users
       WHERE email = $1`,
      [email.trim().toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: "Invalid email or password."
      });
    }

    const user = result.rows[0];
    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        error: "Invalid email or password."
      });
    }

    return res.json({
      message: "Login successful",
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error("Login failed:", error.message);
    return res.status(500).json({ error: "Login failed." });
  }
});

const server = app.listen(PORT, "127.0.0.1", () => {
  console.log(`EVConnect backend running at http://127.0.0.1:${PORT}`);
});

server.on("error", (error) => {
  console.error("Server error:", error.message);
});
