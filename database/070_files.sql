DROP TABLE IF EXISTS files CASCADE;

CREATE TABLE files( 
	id INT PRIMARY KEY,
	tags JSONB,
	url_param TEXT NOT NULL,
	file_path TEXT NOT NULL,
	owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL,
	active BOOLEAN DEFAULT TRUE,	
	uploaded_at timestamptz not null default now()
);
SELECT audit.audit_table('files');

