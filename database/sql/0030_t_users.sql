CREATE TABLE IF NOT EXISTS users(
	id serial primary key,
	email text unique not null,
	first_name text,
	last_name text,
	pw_hash text not null,
	created_at timestamptz not null default now(),
	recover text,
	recover_valid_until timestamptz
);
SELECT setval(pg_get_serial_sequence('users', 'id'), 1000);
SELECT audit.audit_table('users');
