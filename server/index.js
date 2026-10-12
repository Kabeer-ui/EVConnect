
require("dotenv").config({ path: "../.env" });

const express = require("express");
const cors = require("cors");
const pool = require("./db");

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


const server = app.listen(PORT, "127.0.0.1", () => {
  console.log(`EVConnect backend running at http://127.0.0.1:${PORT}`);
});

server.on("error", (error) => {
  console.error("Server error:", error.message);
});
