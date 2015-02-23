
CREATE TABLE IF NOT EXISTS config( 
	id SERIAL PRIMARY KEY,
	config_data JSONB NOT NULL
);
SELECT audit.audit_table('config');
