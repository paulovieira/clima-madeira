
CREATE TABLE IF NOT EXISTS files( 
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	path TEXT NOT NULL,
	tags JSONB  default '[]',
	description JSONB default '{}',
	properties JSONB default '{}',	
	owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
	uploaded_at timestamptz not null default now()
);
SELECT setval(pg_get_serial_sequence('files', 'id'), 1000);
SELECT audit.audit_table('files');

