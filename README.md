![EVConnect — EV Charging Station Discovery Platform](docs/images/evconnect-banner.png)

# EVConnect — EV Charging Station Discovery Platform

EVConnect is an electric-vehicle charging platform designed for the Indian EV ecosystem. It aims to make it easier for EV drivers to discover charging stations, compare station details, and plan charging stops with useful information in one place.

As electric-vehicle adoption grows across India, drivers need accessible information about where charging stations are located and what charging options they offer. EVConnect brings station information into a searchable experience, with a focus on Indian charging infrastructure and a database-backed foundation for organizing station, user, and booking information.

## What EVConnect Offers

- **Charging station discovery:** Explore charging stations and review their available details.
- **Station information:** View location and charging-related attributes such as connector type, charging capacity, operator, pricing, operating hours, and station status where that information is available.
- **Search and filtering:** Narrow down station options using relevant station attributes.
- **Booking workflow:** Navigate the station-booking flow and manage booking information.
- **EV assistant:** Access an assistant interface intended to help users navigate charging-related information.
- **Impact information:** Explore information related to EV adoption and sustainable mobility.

The availability and accuracy of individual station attributes depend on the data recorded for each station. EVConnect is focused on Indian charging stations; it does not imply that every station has live operational or real-time connector availability data.

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite |
| Navigation | React Router |
| Backend API | Node.js, Express |
| Database | PostgreSQL |
| Database administration | pgAdmin 4 |
| Data import | Node.js, `pg`, `csv-parse` |
| Version control | Git and GitHub |

The application is being developed with a PostgreSQL relational database to organize station and related application data. The database and application integration work is being carried out alongside the frontend.

## Database Focus

The existing PostgreSQL database contains the `charging_stations` and `connectors` tables for station data. The vehicle-catalogue work adds a separate, additive schema for manufacturers, vehicle models and variants, connector standards, charging-compatibility records, and source references. The vehicle migration is designed not to drop or alter the existing charging-station tables. Apply the migration before importing the vehicle CSV files.

The enriched station import has been run against the local database. In that run, **1,535 station records were inserted**, **12 rows were skipped** because their IDs or coordinates were missing or invalid, and **2,064 connector rows were inserted**. These are results from the recorded import run, not a guarantee that a fresh database will have identical totals.

The database design and import should continue to be validated for data quality, constraints, normalization, and query correctness. The ER diagram and final schema documentation should reflect the implemented tables separately from planned features.

## Enriched Indian Station Dataset

The enriched CSV contains Indian charging-station details such as station ID, name, address, coordinates, state and city, operator, access type, operating hours, operational status, connector information, pricing, parking fees, rating, and data-verification information. Records with missing IDs or coordinates outside the accepted India bounds are skipped by the importer.

The source CSV is intentionally excluded from Git using `.gitignore`; obtain the dataset separately and place `ev_india_enriched.csv` in the repository root before importing it. Do not commit API keys, database passwords, or the local `.env` file.

From the repository root, after configuring the local `.env` with the PostgreSQL connection variables used by `server/db.js` and the importer, install dependencies and run:

```bash
npm install
node server/scripts/import-enriched-stations.js ./ev_india_enriched.csv
```

The script prints a summary of CSV rows, inserted or updated stations, skipped records, and inserted connector rows. Review that summary and verify the database counts in pgAdmin after running it. The import uses the source station ID to distinguish enriched dataset records from existing Open Charge Map records.

## EV Vehicle Catalogue Dataset

The repository now includes an initial, source-tracked EV vehicle catalogue under `data/vehicles/`. It supports the vehicle-selection workflow and provides structured data for later vehicle-to-charger compatibility checks.

### Dataset files

| File | Purpose |
|---|---|
| `ev_vehicle_database.csv` | Main EV vehicle/variant specifications used by the catalogue |
| `ev_charging_compatibility.csv` | Vehicle-variant and charging-connector compatibility records |
| `ev_connector_standards.csv` | Reference information about supported connector standards |
| `ev_sources.csv` | Source references and notes for catalogue data |
| `ref_manufacturers.csv` | Manufacturer reference records |
| `ref_vehicle_models.csv` | Vehicle-model reference records |

The current dataset is an initial, limited catalogue—not a complete list of every EV sold in India. It includes selected models from Tata Motors, Mahindra, and MG Motor India. Specification coverage and confidence vary by record. Where values are unknown or need verification, the project preserves source notes/uncertainty rather than treating estimates as confirmed facts.

### PostgreSQL schema

The additive migration is located at:

```text
server/sql/vehicle-data/001_vehicle_catalog_schema.sql
```

It creates the relational tables required for vehicle manufacturers, models, variants, connector standards, compatibility records, and data sources. It is intended to be applied to the existing `evconnect_db` database and does not replace the station tables.

### Import the vehicle data

Run these commands from the repository root, assuming PostgreSQL is configured and the server's environment variables are set:

```bash
cd server
npm install
```

Apply the migration to your existing database from the repository root:

```bash
psql -d evconnect_db -f server/sql/vehicle-data/001_vehicle_catalog_schema.sql
```

Then import the catalogue from the `server` directory:

```bash
npm run import:vehicles
```

The importer reads the six CSV files from `data/vehicles/`, uses a database transaction, and upserts records by stable IDs so the import can be rerun without intentionally duplicating catalogue records. Review the command output and verify the imported records in PostgreSQL/pgAdmin. The `psql` command assumes your local PostgreSQL connection is already configured; otherwise, connect using your usual database host, port, username, and database settings.

### Vehicle catalogue API

The Express backend provides these catalogue endpoints:

- `GET /api/vehicles/manufacturers` — lists manufacturers.
- `GET /api/vehicles/models?manufacturerId=<id>` — lists models for a selected manufacturer.
- `GET /api/vehicles/variants?modelId=<id>` — lists variants for a selected model.

The frontend's vehicle selector uses a linked **Manufacturer → Model → Variant** flow and can display available specification information. These endpoints depend on the migration and data import having been run successfully.

**Implementation note:** this work connects the catalogue lookup to PostgreSQL, but it does not by itself mean account registration, user-owned vehicle persistence, or all authentication/profile data has been migrated from frontend/local storage into PostgreSQL. Compatibility data is also limited by the coverage and certainty of the source dataset; do not assume that every EV or charger is represented.

## Current Backend Endpoints

The Express backend runs on port `5000`. Current endpoints include:

- `GET /` — confirms that the backend process is running.
- `GET /api/health` — checks the PostgreSQL connection and returns database health information.
- `GET /api/stations/preview` — requests a preview of India station data from Open Charge Map.
- `POST /api/stations/import` — imports a limited Open Charge Map station set into the database.

These endpoints do not mean that authentication, vehicle profiles, or database-backed booking functionality is complete. Verify the running implementation before describing any planned workflow as implemented.

## Planned User Journey and Data Flow

The following workflow describes the intended behaviour once the application backend is connected to PostgreSQL. It documents the planned architecture and database interactions; it should not be read as confirmation that authentication, vehicle profiles, or database-backed bookings are already implemented.

### 1. Account registration

1. A visitor opens the registration page and enters their name, email address, and password.
2. The React frontend performs basic input validation and sends the registration request to a backend API over HTTPS.
3. The backend validates the request, checks that the email is not already registered, and securely hashes the password. The raw password is never stored in PostgreSQL.
4. The backend inserts the account into a `users` table. PostgreSQL generates the user's primary key, and constraints such as a unique email prevent duplicate accounts.
5. The API returns a success response. The frontend can then direct the user to vehicle setup or the main page.

**Planned database effect:** one row is created in `users`, containing account fields such as `user_id`, `name`, `email`, `password_hash`, and `created_at`. The exact columns will be finalized during schema design.

### 2. Login, authentication, and authorization

1. The user submits their email and password through the login form.
2. The backend retrieves the matching account and verifies the submitted password against its stored password hash.
3. On successful authentication, the backend establishes a secure session or issues an appropriately protected authentication token.
4. Protected API endpoints identify the authenticated user before returning private profile or booking data.
5. Authorization rules restrict administrative operations, such as changing station records, to users with the required role.

Authentication answers **“Who is the user?”** Authorization answers **“What is this user allowed to do?”** Passwords and privileged operations must be handled on the backend, not trusted to frontend-only checks.

### 3. Vehicle profile and charging preferences

After registration, the user selects their EV brand and model and can set preferences such as preferred charging speed, price range, search radius, and charging priority.

The backend stores the vehicle in a `vehicles` table linked to the account through `user_id`. Vehicle specifications—such as supported AC/DC charging modes, connector types, battery capacity, and maximum supported charging power—should be represented in a separate vehicle-model data structure where possible. User preferences belong in a related `charging_preferences` table rather than being mixed with technical vehicle specifications.

This separation lets one user maintain multiple vehicles and lets many users reference the same vehicle model without duplicating its technical specifications.

### 4. Compatible station discovery

When the user opens the station discovery page, the frontend requests station data from the backend using the selected vehicle and search filters.

The backend queries PostgreSQL to compare vehicle compatibility with station charger attributes. It can join vehicle-model and connector records with station and charger records, then filter by connector compatibility, charging mode, supported power, location, price, and recorded station information. Results can be ranked according to the user's saved preferences.

The frontend displays the resulting compatible stations. A charger should not be described as live-available unless a reliable data source provides that status; database booking availability and real-world connector occupancy are separate concepts.

### 5. Time-slot availability and booking

1. The user selects a compatible station, a specific charger, a date, a start time, and a requested duration.
2. The backend checks that the requested interval falls within the station's operating hours and does not overlap a conflicting confirmed booking for the same charger.
3. The backend creates the booking inside a PostgreSQL transaction and uses suitable database constraints or locking to prevent two concurrent requests from reserving the same charger and time.
4. If the reservation succeeds, the backend returns a confirmation and the frontend displays it. If the slot is no longer available, the user is asked to select another time.
5. The booking is linked to both the user and the charger through foreign keys. Users can retrieve or cancel their own bookings according to the booking rules.

The planned `bookings` table will hold fields such as `booking_id`, `user_id`, `charger_id`, `start_time`, `end_time`, `status`, and timestamps. PostgreSQL constraints and transaction handling will protect referential integrity and booking consistency. A reservation system can determine occupancy from its own bookings; actual physical charger occupancy requires reliable live station or operator data.

### 6. Personalized dashboard

After login, the dashboard requests the user's saved profile, vehicles, preferences, compatible station results, and upcoming bookings from backend endpoints. The backend retrieves each set of records from PostgreSQL using the authenticated user's identifier. The frontend presents the data without directly connecting to the database.

### Planned relational entities

| Table / entity | Responsibility |
|---|---|
| `users` | Account identity and password hash |
| `roles` and `user_roles` | Authorization roles assigned to users |
| `vehicles` | Vehicles registered by a user |
| `vehicle_models` | Reusable vehicle specifications by brand and model |
| `vehicle_connectors` | Connector types supported by a vehicle model |
| `charging_preferences` | User-selected price, speed, distance, and ranking preferences |
| `stations` | Station location, operator, hours, and available station details |
| `chargers` | Individual charger power and charging attributes |
| `charger_connectors` | Connector types provided by each charger |
| `bookings` | User reservations, charger, time interval, and status |

These are proposed entities rather than a claim that the final schema is already deployed. Table names, columns, and relationships will be aligned with the implemented ER diagram and SQL schema.

### Intended application architecture

```text
React + TypeScript frontend
          |
          | HTTPS API requests
          v
Backend API
(validation, authentication, authorization,
compatibility checks, booking logic)
          |
          | SQL queries / transactions
          v
PostgreSQL database
(users, vehicles, stations, chargers, bookings)
```

The frontend will communicate with PostgreSQL through the backend API rather than connecting directly to the database. Database credentials will remain on the server side and will not be exposed in frontend code.

## Team Members

| Name | PRN / Roll Number |
|---|---|
| Monish Jain | 1262241544 |
| Kabeer Barot | 1262241539 |

## Project Goal

EVConnect aims to make EV charging information easier to explore and use in the Indian context. By combining a user-facing station discovery experience with a relational database, the project brings together application development and core DBMS concepts such as relational modelling, data integrity, structured queries, and connected application data.

## Repository

[GitHub Repository](https://github.com/Kabeer-ui/EVConnect)
