
CREATE TABLE IF NOT EXISTS groups(
	id serial primary key,
	code int unique not null,
	name text not null
);


DO $$
DECLARE
	_has_executed BOOLEAN;
	_flag TEXT := 'create_table_groups';
BEGIN

	-- get the flag for this file
	SELECT EXISTS (
		SELECT 1 FROM code_has_executed WHERE code = _flag
	) INTO _has_executed;

	if _has_executed is false then

		-- the following sql lines will be executed only the first time this file is run
		PERFORM setval(pg_get_serial_sequence('groups', 'id'), 1000);
		PERFORM audit.audit_table('groups');

		-- add the flag to the table
		INSERT INTO code_has_executed(code) VALUES(_flag);
	end if;
END
$$




