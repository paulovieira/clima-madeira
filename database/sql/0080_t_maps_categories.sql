
CREATE TABLE IF NOT EXISTS maps_categories( 
	id SERIAL PRIMARY KEY,
	code TEXT NOT NULL UNIQUE,
	name JSONB NOT NULL default '{}',
	description JSONB default '{}',
	properties JSONB default '{}',	
	created_at timestamptz not null default now()
);

DO $$
DECLARE
	_has_executed BOOLEAN;
	_flag TEXT := 'create_table_maps_categories';
BEGIN

	-- get the flag for this file
	SELECT EXISTS (
		SELECT 1 FROM code_has_executed WHERE code = _flag
	) INTO _has_executed;

	if _has_executed is false then

		-- the following sql lines will be executed only the first time this file is run
		PERFORM setval(pg_get_serial_sequence('maps_categories', 'id'), 1000);
		PERFORM audit.audit_table('maps_categories');

		-- add the flag to the table
		INSERT INTO code_has_executed(code) VALUES(_flag);
	end if;
END
$$



