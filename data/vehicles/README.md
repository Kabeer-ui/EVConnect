# EVConnect Vehicle Dataset

This folder stores the source CSV files for the vehicle and charging-compatibility dataset used by EVConnect.

## Place these CSV files in this folder

- `ev_vehicle_database.csv`
- `ev_charging_compatibility.csv`
- `ev_connector_standards.csv`
- `ev_sources.csv`
- `ref_manufacturers.csv`
- `ref_vehicle_models.csv`

These are source/reference data files. They do not automatically populate PostgreSQL; the import SQL/script will be added after we compare the dataset schema with the existing database schema.

## Data quality

Keep source URLs, notes, and verification statuses intact. Some specifications are marked conflicting, unverified, or uncertain. A missing compatibility record must not be interpreted as proof that a vehicle is incompatible.

## Safety

Do not place `.env` files, database passwords, API keys, or real user data in this folder.