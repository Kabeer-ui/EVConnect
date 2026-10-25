# Vehicle Data Import Scripts

Place the script that imports `data/vehicles/*.csv` into PostgreSQL in this folder.

Recommended future file: `import-vehicle-data.js` or `import-vehicle-data.py`, depending on the existing project tooling. The importer should validate row counts and foreign-key relationships, and it should be safe to rerun without duplicating records.