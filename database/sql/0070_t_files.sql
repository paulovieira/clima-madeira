
CREATE TABLE IF NOT EXISTS files( 
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	path TEXT NOT NULL,
	tags JSONB  default '[]',
	description JSONB default '{}',
	properties JSONB default '{}',	
	owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
	uploaded_at timestamptz not null default now()
);



-- DO $$
-- DECLARE
-- 	_has_executed BOOLEAN;
-- 	_flag TEXT := 'create_table_files';
-- BEGIN

-- 	-- get the flag for this file
-- 	SELECT EXISTS (
-- 		SELECT 1 FROM code_has_executed WHERE code = _flag
-- 	) INTO _has_executed;

-- 	if _has_executed is false then

-- 		-- the following sql lines will be executed only the first time this file is run
-- 		PERFORM setval(pg_get_serial_sequence('files', 'id'), 1000);
-- 		PERFORM audit.audit_table('files');

-- 		-- add the flag to the table
-- 		INSERT INTO code_has_executed(code) VALUES(_flag);
-- 	end if;
-- END
-- $$



-- new version




DO $$
DECLARE
	_has_executed BOOLEAN;
	_table_exists BOOLEAN;
	_flag TEXT := 'create_table_files';
	_table_name TEXT := 'files';
BEGIN

	-- get the flag for this file
	SELECT EXISTS (
		SELECT 1 FROM code_has_executed WHERE code = _flag
	) INTO _has_executed;

	-- check if the table exists
	SELECT EXISTS (
	   SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = _table_name
	) INTO _table_exists;

	if _has_executed is false AND _table_exists is true then

		-- the following sql lines will be executed only the first time this file is run
		PERFORM setval(pg_get_serial_sequence('files', 'id'), 1000);
		PERFORM audit.audit_table('files');

		-- add the flag to the table
		INSERT INTO code_has_executed(code) VALUES(_flag);
	else
		RAISE NOTICE 'xxx';
	end if;
END
$$

