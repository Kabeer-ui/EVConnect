# Vehicle–Charger Compatibility Layer: Integration Plan

## Goal
Keep the vehicle specification and compatibility layer isolated from `main` until the existing PostgreSQL station integration has been verified. This document is a checklist, not a claim that the layer is already deployed.

## Phase 1 — Preserve the current state
- Confirm `main` still starts and `GET /api/health` connects to PostgreSQL.
- Back up the development database before running any schema or import scripts.
- Keep the uploaded dataset and patch as the source snapshot; do not overwrite local work.
- Do not run a migration that drops/recreates vehicle or station tables against a database containing valuable data.

## Phase 2 — Add the vehicle reference dataset
Add the following files under `database/`:
- `data/ev_vehicle_database.csv`
- `data/ev_charging_compatibility.csv`
- `data/ev_connector_standards.csv`
- `data/ev_sources.csv`
- `data/ref_manufacturers.csv`
- `data/ref_vehicle_models.csv`
- `schema/001_vehicle_compatibility.sql`
- `queries/compatibility_queries.sql`
- `scripts/build_dataset.py`
- `scripts/import_data.py`
- `scripts/validate.py`
- `docs/validation_report.md`
- `README.md`

Treat this as a partial seed dataset: 8 models, 13 variants, 26 compatibility rows, 20 secondary-source records, and no official-source rows. Do not describe it as comprehensive coverage of Indian EVs. Unknown values must remain NULL; a missing compatibility row means “not documented”, not “incompatible”.

## Phase 3 — Validate the schema and data before integration
1. Review all foreign keys, unique constraints, check constraints, indexes, and the vehicle lookup view.
2. Run `python3 build_dataset.py && python3 validate.py`.
3. Confirm the report explicitly states whether live PostgreSQL checks ran or were skipped.
4. Test the import against a disposable development database first. Run the import twice and compare row counts/IDs to check repeatability.
5. Use a non-destructive upgrade migration for any existing database; reserve drop/recreate behavior for an explicitly disposable database.
6. Fix nullable-power handling in compatibility queries: if either charger rated power or vehicle-supported power is unknown, the estimated power should be NULL rather than treating the known side as the answer.

## Phase 4 — Link station connectors safely
- Map Open Charge Map connector labels to normalized connector standards only when the mapping is evidence-based.
- Run the unmapped-connector query and review common unmapped labels.
- Avoid deleting/reinserting connector rows if their IDs may later be referenced by bookings. Prefer stable IDs and upserts.
- Keep the station module's `charging_points`/connector schema distinct from vehicle specifications; document the join path clearly.

## Phase 5 — Backend API
Add and test:
- `GET /api/vehicles`
- `GET /api/vehicles/:variantId`
- `GET /api/vehicles/:variantId/compatible-stations`

Check invalid IDs, empty results, unknown/conflicting evidence, unsupported connectors, missing station coordinates, and NULL power values. The API must not imply live availability merely from compatibility. Verify database errors return safe responses and are logged server-side.

## Phase 6 — Frontend client and later UI wiring
- Add the vehicle API client and TypeScript response types.
- Keep the client separate from the existing mock-backed screens until the API passes tests.
- After PostgreSQL integration is stable, add a vehicle-variant selector to charger discovery and label evidence/confidence clearly.
- Do not wire bookings or claim live occupancy as part of this layer; compatibility and availability are separate concerns.

## Phase 7 — Quality checks
Run the server tests (or add endpoint tests if absent), the frontend TypeScript/build checks, the CSV/schema validator, and the PostgreSQL import tests. Confirm the existing station endpoints and health check still work.

## Phase 8 — Commit and merge sequence
Use small commits on `feature/vehicle-compatibility-layer`, for example:
1. `feat(db): add vehicle compatibility schema and seed dataset`
2. `feat(api): add vehicle compatibility endpoints`
3. `fix(db): make station connector linking safe and repeatable`
4. `test(api): cover vehicle compatibility edge cases`
5. `feat(ui): add vehicle-based charger discovery`
6. `docs(db): document import, evidence quality, and integration`

Open a pull request into `main` only after PostgreSQL integration and regression checks pass. Do not merge it before review.

## Current status
The branch exists, and this checklist is committed here. The feature source files from the uploaded archive still need to be applied/pushed from a working checkout; this checklist alone does not implement the endpoints or import the dataset.
