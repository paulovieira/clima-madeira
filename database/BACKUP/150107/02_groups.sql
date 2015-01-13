
drop table if exists users_groups cascade;
drop table if exists groups cascade;

create table groups(
	id serial primary key,
	code int unique not null,
	name text not null
);
SELECT audit.audit_table('groups');

