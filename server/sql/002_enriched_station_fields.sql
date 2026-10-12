
-- Migration 002: Enrich charging station and connector data

ALTER TABLE public.charging_stations
    ADD COLUMN IF NOT EXISTS source_station_id TEXT,
    ADD COLUMN IF NOT EXISTS operator_name TEXT,
    ADD COLUMN IF NOT EXISTS state TEXT,
    ADD COLUMN IF NOT EXISTS city TEXT,
    ADD COLUMN IF NOT EXISTS access_type TEXT,
    ADD COLUMN IF NOT EXISTS operating_hours TEXT,
    ADD COLUMN IF NOT EXISTS operational_status TEXT,
    ADD COLUMN IF NOT EXISTS ev_charging_price NUMERIC(10, 2),
    ADD COLUMN IF NOT EXISTS parking_fee NUMERIC(10, 2),
    ADD COLUMN IF NOT EXISTS user_rating NUMERIC(3, 2),
    ADD COLUMN IF NOT EXISTS data_source TEXT,
    ADD COLUMN IF NOT EXISTS data_last_verified DATE;

CREATE UNIQUE INDEX IF NOT EXISTS
    uq_charging_stations_source_station_id
ON public.charging_stations (source_station_id)
WHERE source_station_id IS NOT NULL;

ALTER TABLE public.connectors
    ADD COLUMN IF NOT EXISTS connector_count INTEGER,
    ADD COLUMN IF NOT EXISTS charger_grade TEXT,
    ADD COLUMN IF NOT EXISTS bharat_standard TEXT;
