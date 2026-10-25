-- EVConnect vehicle catalogue; additive migration, does not modify station tables.
CREATE TABLE IF NOT EXISTS vehicle_data_sources (
  source_id INTEGER PRIMARY KEY,
  source_url TEXT NOT NULL,
  source_organization TEXT,
  source_type TEXT,
  accessed_at DATE,
  publication_date DATE,
  supports TEXT
);

CREATE TABLE IF NOT EXISTS vehicle_manufacturers (
  manufacturer_id INTEGER PRIMARY KEY,
  manufacturer_name TEXT NOT NULL UNIQUE,
  country_of_origin TEXT
);

CREATE TABLE IF NOT EXISTS vehicle_models (
  vehicle_model_id INTEGER PRIMARY KEY,
  manufacturer_id INTEGER NOT NULL REFERENCES vehicle_manufacturers(manufacturer_id),
  model_name TEXT NOT NULL,
  vehicle_category TEXT,
  body_type TEXT,
  market_status TEXT,
  UNIQUE (manufacturer_id, model_name)
);

CREATE TABLE IF NOT EXISTS vehicle_variants (
  variant_id INTEGER PRIMARY KEY,
  vehicle_model_id INTEGER NOT NULL REFERENCES vehicle_models(vehicle_model_id),
  variant_name TEXT NOT NULL,
  model_year_start INTEGER,
  model_year_end INTEGER,
  battery_capacity_kwh NUMERIC(7,2),
  battery_capacity_type TEXT,
  ac_charging_support BOOLEAN,
  dc_charging_support BOOLEAN,
  ac_connector_type TEXT,
  dc_connector_type TEXT,
  max_ac_power_kw NUMERIC(7,2),
  max_dc_power_kw NUMERIC(7,2),
  nominal_voltage_v NUMERIC(8,2),
  charging_port_config TEXT,
  spec_source_id INTEGER REFERENCES vehicle_data_sources(source_id),
  specification_source_url TEXT,
  source_type TEXT,
  specification_verification_status TEXT,
  last_verified_date DATE,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS vehicle_connector_standards (
  connector_id INTEGER PRIMARY KEY,
  connector_name TEXT NOT NULL,
  charging_mode TEXT NOT NULL,
  standard_description TEXT,
  reference_source_id INTEGER REFERENCES vehicle_data_sources(source_id),
  notes TEXT
);

CREATE TABLE IF NOT EXISTS vehicle_charging_compatibility (
  support_id INTEGER PRIMARY KEY,
  variant_id INTEGER NOT NULL REFERENCES vehicle_variants(variant_id) ON DELETE CASCADE,
  connector_id INTEGER NOT NULL REFERENCES vehicle_connector_standards(connector_id),
  charging_mode TEXT NOT NULL,
  max_supported_power_kw NUMERIC(7,2),
  compatibility_status TEXT,
  source_id INTEGER REFERENCES vehicle_data_sources(source_id),
  evidence_source_url TEXT,
  verification_status TEXT,
  technical_notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_vehicle_models_manufacturer ON vehicle_models(manufacturer_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_variants_model ON vehicle_variants(vehicle_model_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_compatibility_variant ON vehicle_charging_compatibility(variant_id);
