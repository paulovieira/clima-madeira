
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


DO $$
DECLARE
	_has_executed BOOLEAN;
	_flag TEXT := 'create_table_users';
BEGIN

	-- get the flag for this file
	SELECT EXISTS (
		SELECT 1 FROM code_has_executed WHERE code = _flag
	) INTO _has_executed;

	if _has_executed is false then

		-- the following sql lines will be executed only the first time this file is run
		PERFORM setval(pg_get_serial_sequence('users', 'id'), 1000);
		PERFORM audit.audit_table('users');

		-- add the flag to the table
		INSERT INTO code_has_executed(code) VALUES(_flag);
	end if;
END
$$
