
CREATE TABLE IF NOT EXISTS config( 
	id SERIAL PRIMARY KEY,
	config_data JSONB NOT NULL
);

DO $$
DECLARE
	_has_executed BOOLEAN;
	_flag TEXT := 'create_table_config';
BEGIN

	-- get the flag for this file
	SELECT EXISTS (
		SELECT 1 FROM code_has_executed WHERE code = _flag
	) INTO _has_executed;

	if _has_executed is false then

		-- the following sql lines will be executed only the first time this file is run
		PERFORM audit.audit_table('config');

		-- add the flag to the table
		INSERT INTO code_has_executed(code) VALUES(_flag);
	end if;
END
$$

