
const { Pool } = require("pg");
require("dotenv").config({ path: "../.env" });

const pool = new Pool({
  host: process.env.PGHOST || "localhost",
  port: Number(process.env.PGPORT || 5432),
  database: process.env.PGDATABASE || "evconnect_db",
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD,
});

module.exports = pool;
