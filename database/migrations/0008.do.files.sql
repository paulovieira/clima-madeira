DROP TABLE IF EXISTS files CASCADE;

CREATE TABLE files( 
	id INT PRIMARY KEY,
	path TEXT default '',
	name TEXT NOT NULL,
	tags JSONB,
	owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL,
	public BOOLEAN DEFAULT TRUE,	
	created_at timestamptz not null default now()
);
SELECT audit.audit_table('files');

