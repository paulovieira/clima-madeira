
CREATE TABLE IF NOT EXISTS groups(
	id serial primary key,
	code int unique not null,
	name text not null
);
SELECT setval(pg_get_serial_sequence('groups', 'id'), 1000);
SELECT audit.audit_table('groups');

