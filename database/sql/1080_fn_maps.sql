
/*

	1. READ

*/


DROP FUNCTION IF EXISTS maps_read(json);

CREATE FUNCTION maps_read(options json DEFAULT '[{}]')

-- return table, uses the definition of the maps table + extra data from the join
RETURNS TABLE(
	id INT,
	name TEXT,
	category TEXT,
	table_name TEXT,
	description JSONB,
	properties JSONB,
	owner_id INT,
	created_at timestamptz,
	owner_data JSON)
AS
$BODY$

DECLARE
	options_row json;
	command text;
	number_conditions INT;

	-- fields to be used in WHERE clause
	id INT;
BEGIN


FOR options_row IN ( select json_array_elements(options) ) LOOP

	command := 'SELECT 
			m.*, 
			(select row_to_json(_dummy_) from (select u.*) as _dummy_) as owner_data
		FROM maps m 
		INNER JOIN users u
		ON m.owner_id = u.id';
			
	-- extract values to be (optionally) used in the WHERE clause
	SELECT json_extract_path_text(options_row, 'id')           INTO id;

	number_conditions := 0;

	-- criteria: id
	IF id IS NOT NULL THEN
		IF number_conditions = 0 THEN  command = command || ' WHERE';  
		ELSE                           command = command || ' AND';
		END IF;

		command = format(command || ' m.id = %L', id);
		number_conditions := number_conditions + 1;
	END IF;


	command := command || ' ORDER BY m.id;';

	RETURN QUERY EXECUTE command;

END LOOP;
		
RETURN;
END;
$BODY$
LANGUAGE plpgsql;



/*
select * from maps

select * from maps_read('[{}]');
select * from maps_read('[{"tags": "tag1"}]');
select * from  maps_read('[{"email":"paulovieira@gmail.com"}, {"id":"2"}]');
select * from  maps_read('[{"id":"1"}]');
select * from  maps_read('[{"owner_id":"2"}]');

*/




/*

	2. CREATE

*/

/*
DROP FUNCTION IF EXISTS maps_create(json, json);

CREATE FUNCTION maps_create(input_data json, options json DEFAULT '[{}]')
RETURNS SETOF maps AS
$BODY$
DECLARE
	new_row     maps%ROWTYPE;
	input_row   maps%ROWTYPE;
	current_row maps%ROWTYPE;

	new_id INT;
BEGIN

FOR input_row IN (select * from json_populate_recordset(null::maps, input_data)) LOOP

	SELECT input_row.id INTO new_id;

	-- we proceed with the insert in 2 cases: 
	--   a) if the id was not given (in which case we retrieve a new id from the sequence); 
	--   b) if the id was given and there is no record with that id

	-- NOTE: if the id has not been given, the data comes from the user interface; otherwise, it comes from the initial data;
	IF new_id IS NULL OR NOT EXISTS (SELECT * FROM maps WHERE id = new_id) THEN

		INSERT INTO maps(
			id,
			name,
			path,
			tags, 
			description,
			properties, 
			owner_id
			)
		VALUES (
			COALESCE(new_id, nextval(pg_get_serial_sequence('maps', 'id'))),
			input_row.name, 
			input_row.path, 
			input_row.tags, 
			input_row.description, 
			input_row.properties, 
			input_row.owner_id
			)
		RETURNING 
			*
		INTO STRICT 
			new_row;

		RETURN NEXT new_row;

	ELSE

		current_row.id = new_id;
		current_row.name = '"WARNING: a row with the given id exists already present. Data will not be inserted."';

		RAISE WARNING 'A row with the given id exists already present. Data will not be inserted (id=%)', current_row.id;

		RETURN NEXT current_row;

	END IF;

END LOOP;

RETURN;
END;
$BODY$
LANGUAGE plpgsql;
*/

/*
select * from maps order by id desc

select * from maps_create('[
{
	"name": "relatório.pdf",
	"path": "/upload/paulo",
	"tags": ["tag3", "tag4"],
	"owner_id": 2
}
]')


select * from maps_create('[
{
	"name": "relatório3.pdf",
	"path": "/upload/paulo",
	"owner_id": 2,
	"id": 1
}
]')

*/



/*

	3. UPDATE

*/

/*
DROP FUNCTION IF EXISTS maps_update(json, json);

CREATE FUNCTION maps_update(input_data json, options json DEFAULT '[{}]')
RETURNS SETOF maps AS
$$
DECLARE
	updated_row maps%ROWTYPE;
	input_row maps%ROWTYPE;
	command text;
BEGIN

FOR input_row IN (select * from json_populate_recordset(null::maps, input_data)) LOOP

	-- generate a dynamic command: first the base query
	command := 'UPDATE maps SET ';

	-- first use the fields that will always be updated
--	command = format(command || 'uploaded_at = %L, ', now());

	-- then add (cumulatively) the fields to be updated; those fields must be present in the input_data json;
	IF input_row.name IS NOT NULL THEN
		command = format(command || 'name = %L, ', input_row.name);
	END IF;
	IF input_row.path IS NOT NULL THEN
		command = format(command || 'path = %L, ', input_row.path);
	END IF;
	IF input_row.tags IS NOT NULL THEN
		command = format(command || 'tags = %L, ', input_row.tags);
	END IF;
	IF input_row.description IS NOT NULL THEN
		command = format(command || 'description = %L, ', input_row.description);
	END IF;
	IF input_row.properties IS NOT NULL THEN
		command = format(command || 'properties = %L, ', input_row.properties);
	END IF;
	IF input_row.owner_id IS NOT NULL THEN
		command = format(command || 'owner_id = %L, ', input_row.owner_id);
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
*/

/*
select * from maps order by id desc

select * from maps_update('[{"id": 1, "name": "relatório2.pdf", "tags": ["tag5"]}]');
select * from maps_update('[{"id": 1, "tags": ["tag7"] }]');

*/






/*

	4. DELETE

*/

/*
DROP FUNCTION IF EXISTS maps_delete(json);

CREATE FUNCTION maps_delete(options json DEFAULT '[{}]')
RETURNS TABLE(deleted_id int) AS
$$
DECLARE
	deleted_row maps%ROWTYPE;
	options_row JSON;

	-- fields to be used in WHERE clause
	id_to_delete INT;
BEGIN

FOR options_row IN ( select json_array_elements(options) ) LOOP

	-- extract values to be (optionally) used in the WHERE clause
	SELECT json_extract_path_text(options_row, 'id') INTO id_to_delete;
	
	IF id_to_delete IS NOT NULL THEN
		DELETE FROM maps
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
*/


/*

select * from maps order by id desc;

select * from maps_delete('[{"id": 253}, {"id": 253}]');
select * from maps_delete('[{"id": 13}]');
*/




