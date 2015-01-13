DROP TABLE IF EXISTS general_config CASCADE;

CREATE TABLE general_config( 
	id SERIAL PRIMARY KEY,
	code TEXT UNIQUE NOT NULL,
	config_data JSONB NOT NULL
);
SELECT audit.audit_table('general_config');
