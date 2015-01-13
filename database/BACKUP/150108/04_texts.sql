DROP TABLE IF EXISTS texts CASCADE;

CREATE TABLE texts( 
	id SERIAL PRIMARY KEY,
	tags JSONB,
	contents JSONB NOT NULL,
	contents_desc JSONB,
	author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL,
	active BOOLEAN DEFAULT TRUE,	
	last_updated timestamptz not null default now()
);
SELECT audit.audit_table('texts');

