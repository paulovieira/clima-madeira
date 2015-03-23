
CREATE TABLE IF NOT EXISTS maps( 
	id SERIAL PRIMARY KEY,
	code TEXT NOT NULL UNIQUE,
	title JSONB NOT NULL default '{}',
	description JSONB default '{}',
	properties JSONB default '{}',	
	category_id INT references texts(id)  on update cascade on delete set null,
	table_name TEXT NOT NULL,
	owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
	created_at timestamptz not null default now()
);



DO $$
DECLARE
	_has_executed BOOLEAN;
	_table_exists BOOLEAN;
	_flag TEXT := 'create_table_maps';
	_table_name TEXT := 'maps';
BEGIN

	-- get the flag for this file
	SELECT EXISTS (
		SELECT 1 FROM code_has_executed WHERE code = _flag
	) INTO _has_executed;

	-- check if the table exists
	SELECT EXISTS (
	   SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = _table_name
	) INTO _table_exists;

	if _table_exists is true AND _has_executed is false then

		-- the following sql lines will be executed only the first time this file is run
		PERFORM setval(pg_get_serial_sequence('maps', 'id'), 1000);
		PERFORM audit.audit_table('maps');

		-- add the flag to the table
		INSERT INTO code_has_executed(code) VALUES(_flag);
	end if;
END
$$

