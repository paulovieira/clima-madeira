--select * from general_config order by id desc;
--delete from general_config where id >= 3


/*

	1. READ

*/


DROP FUNCTION if exists general_config_read(json);

CREATE OR REPLACE FUNCTION general_config_read(options json DEFAULT '[{}]')

-- return table using the definition of the general_config table
RETURNS TABLE(
	id          INT,
	code        TEXT,
	config_data JSONB
)
AS
$BODY$

DECLARE
	options_row json;
	command text;
	number_conditions INT;

	-- fields to be used in WHERE clause
	id INT;
	code TEXT;
BEGIN


FOR options_row IN ( select json_array_elements(options) ) LOOP

	command := 'SELECT * FROM general_config ';
			
	-- extract values to be (optionally) used in the WHERE clause
	SELECT json_extract_path_text(options_row, 'id')    INTO id;
	SELECT json_extract_path_text(options_row, 'code')  INTO code;

	number_conditions := 0;
	
	-- criteria: id
	IF id IS NOT NULL THEN
		IF number_conditions = 0 THEN  command = command || ' WHERE';  
		ELSE                           command = command || ' AND';
		END IF;

		command = format(command || ' id = %L', id);
		number_conditions := number_conditions + 1;
	END IF;

	-- criteria: code
	IF code IS NOT NULL THEN
		IF number_conditions = 0 THEN  command = command || ' WHERE';  
		ELSE                           command = command || ' AND';
		END IF;

		command = format(command || ' code = %L', code);
		number_conditions := number_conditions + 1;
	END IF;

	
	command := command || ' ORDER BY id;';

	RETURN QUERY EXECUTE command;

END LOOP;
		
RETURN;
END;
$BODY$
LANGUAGE plpgsql;




/*
select * from general_config

select * from  general_config_read('[{}]');
select * from  general_config_read('[{"code": 99, "id": 1}]');
select * from  general_config_read('[{"id":"1"}, {"id":"2"}]');

*/




/*

	2. CREATE

*/

DROP FUNCTION if exists general_config_create(json, json);

CREATE OR REPLACE FUNCTION general_config_create(input_data json, options json DEFAULT '[{}]')
RETURNS SETOF general_config AS
$BODY$
DECLARE
	new_row general_config%ROWTYPE;
	input_row general_config%ROWTYPE;
BEGIN

FOR input_row IN (select * from json_populate_recordset(null::general_config, input_data)) LOOP
	INSERT INTO general_config(
		code,
		config_data
		)
	VALUES (
		input_row.code,
		input_row.config_data
		)
	RETURNING 
		*
	INTO STRICT 
		new_row;
	
	RETURN NEXT new_row;
END LOOP;

RETURN;
END;
$BODY$
LANGUAGE plpgsql;

/*
select * from general_config order by id desc

select * from general_config_create('[{"code": "zzz"}]');

select * from general_config_create('[
	{"code": "menu"}, 
	{"code": "admin_email", '{"email": "paulo@gmail.com"}'}
]');


*/




/*

	3. UPDATE

*/


DROP FUNCTION if exists general_config_update(json, json);

CREATE OR REPLACE FUNCTION general_config_update(input_data json, options json DEFAULT '[{}]')
RETURNS SETOF general_config AS
$$
DECLARE
	updated_row general_config%ROWTYPE;
	input_row general_config%ROWTYPE;
	command text;
BEGIN

FOR input_row IN (select * from json_populate_recordset(null::general_config, input_data)) LOOP

	-- generate a dynamic command: first the base query
	command := 'UPDATE general_config SET ';

	-- then add (cumulatively) the fields to be updated; those fields must be present in the input_data json;
	IF input_row.code IS NOT NULL THEN
		command = format(command || 'code = %L, ', input_row.code);
	END IF;
	IF input_row.config_data IS NOT NULL THEN
		command = format(command || 'config_data = %L, ', input_row.config_data);
	END IF;

	-- remove the comma and space from the last if
	command = left(command, -2);
	command = format(command || ' WHERE id = %L RETURNING *;', input_row.id);

	--RAISE NOTICE 'Dynamic command: %', command;

	EXECUTE 
		command

	INTO STRICT
		updated_row;


	RETURN NEXT 
		updated_row;
END LOOP;

RETURN;
END;
$$
LANGUAGE plpgsql;


/*
select * from general_config order by id desc


select * from general_config_update('[
	{"id": "2", "code": 41},
	{"id": "3", "code": 40}
]');

select * from general_config_update('[
	{"id": "6", "config_data": ["uuuuuuu"]},
	{"id": "5", "config_data": [999]}
]');


*/





/*

	4. DELETE

*/

CREATE OR REPLACE FUNCTION general_config_delete(options json DEFAULT '[{}]')
RETURNS TABLE(deleted_id int) AS
$$
DECLARE
	deleted_row general_config%ROWTYPE;
	options_row JSON;

	-- fields to be used in WHERE clause
	id_to_delete INT;
BEGIN

FOR options_row IN ( select json_array_elements(options) ) LOOP

	-- extract values to be (optionally) used in the WHERE clause
	SELECT json_extract_path_text(options_row, 'id') INTO id_to_delete;
	
	IF id_to_delete IS NOT NULL THEN
		DELETE FROM general_config
		WHERE id = id_to_delete
		RETURNING *
		INTO deleted_row;

		deleted_id   := deleted_row.id;

		IF deleted_id IS NOT NULL THEN
			RETURN NEXT;
		END IF;
	END IF;
		
END LOOP;

RETURN;
END;
$$
LANGUAGE plpgsql;


/*

select * from general_config order by id desc;
select * from general_config_delete('[{"id": 3}]');
*/



