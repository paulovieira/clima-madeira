CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;

create table seeds_checksum(
	id serial primary key,
	name text not null,
	md5 text not  null
);
SELECT audit.audit_table('seeds_checksum');