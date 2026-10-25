# Vehicle Catalogue SQL

Run `001_vehicle_catalog_schema.sql` against the existing `evconnect_db` PostgreSQL database. This is an additive migration and does not modify charging station tables.

Then import the six CSV files from `data/vehicles/` using `npm run import:vehicles` from the `server` directory. The importer is idempotent and keeps unknown/conflicting specification values and source notes rather than inventing data.
