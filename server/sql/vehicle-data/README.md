# Vehicle Data SQL

Place the PostgreSQL schema/migration SQL for the vehicle dataset in this folder after checking the existing schema.

Recommended future file: `001_vehicle_compatibility_schema.sql`.

Do not run a script that drops or recreates existing tables. The vehicle tables should integrate with the current EVConnect station/connector schema, and the importer should preserve nullable and verification fields from the CSV dataset.