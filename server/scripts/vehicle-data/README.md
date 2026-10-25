# Vehicle Catalogue Import

The importer is `server/scripts/import-vehicle-catalog.js`. Run it from the `server` directory after applying `server/sql/vehicle-data/001_vehicle_catalog_schema.sql`:

```sh
npm install
npm run import:vehicles
```

It reads the six CSV files from `data/vehicles/`, uses a transaction, and upserts by stable IDs so rerunning it does not duplicate records.
