drop table if exists users_groups cascade;
drop table if exists users cascade;

create table users(
	id serial primary key,
	email text unique not null,
	first_name text,
	last_name text,
	pw_hash text not null,
	created_at timestamptz not null default now(),
	recover text,
	recover_valid_until timestamptz

);
SELECT audit.audit_table('users');
