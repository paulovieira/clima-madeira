
CREATE TABLE IF NOT EXISTS maps( 
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	category TEXT NOT NULL,
	table_name TEXT NOT NULL,
	description JSONB default '{}',
	properties JSONB default '{}',	
	owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
	created_at timestamptz not null default now()
);

DO $$
DECLARE
	_has_executed BOOLEAN;
	_flag TEXT := 'create_table_maps';
BEGIN

	-- get the flag for this file
	SELECT EXISTS (
		SELECT 1 FROM code_has_executed WHERE code = _flag
	) INTO _has_executed;

	if _has_executed is false then

		-- the following sql lines will be executed only the first time this file is run
		PERFORM setval(pg_get_serial_sequence('maps', 'id'), 1000);
		PERFORM audit.audit_table('maps');

		-- add the flag to the table
		INSERT INTO code_has_executed(code) VALUES(_flag);
	end if;
END
$$



