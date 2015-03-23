
/*

	1. READ

*/


DROP FUNCTION IF EXISTS maps_read(json);

CREATE FUNCTION maps_read(options json DEFAULT '[{}]')

-- return table, uses the definition of the maps table + extra data from the join
RETURNS TABLE(
	id INT,
	code TEXT,
	title JSONB,
	description JSONB,
	properties JSONB,
	category_id INT,
	file_id INT,
	table_name TEXT,
	owner_id INT,
	created_at timestamptz,
	owner_data JSON,
	category_data JSON)
AS
$BODY$

DECLARE
	options_row json;
	command text;
	number_conditions INT;

	-- fields to be used in WHERE clause
	id INT;
BEGIN

-- convert the json argument from object to array of (one) objects
IF  json_typeof(options) = 'object'::text THEN
	options = ('[' || options::text ||  ']')::json;
END IF;


FOR options_row IN ( select json_array_elements(options) ) LOOP

	command := 'SELECT 
			m.*, 
			(select row_to_json(_dummy_) from (select u.*) as _dummy_) as owner_data,
			(select row_to_json(_dummy_) from (select t.*) as _dummy_) as category_data
		FROM maps m 
		LEFT JOIN users u
		ON m.owner_id = u.id
		INNER JOIN texts t
		ON m.category_id = t.id';
			
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


DROP FUNCTION IF EXISTS maps_create(json, json);

CREATE FUNCTION maps_create(input_data json, options json DEFAULT '[{}]')
RETURNS SETOF maps AS
$BODY$
DECLARE
	new_row maps%ROWTYPE;
	input_row maps%ROWTYPE;
	current_row maps%ROWTYPE;
	new_id INT;
BEGIN

-- convert the json argument from object to array of (one) objects
IF  json_typeof(input_data) = 'object'::text THEN
	input_data = ('[' || input_data::text ||  ']')::json;
END IF;


FOR input_row IN (select * from json_populate_recordset(null::maps, input_data)) LOOP

	SELECT input_row.id INTO new_id;

	-- we proceed with the insert in 2 cases: 
	--   a) if the id was not given (in which case we retrieve a new id from the sequence); 
	--   b) if the id was given and there is no record with that id

	-- NOTE: if the id has not been given, the data comes from the user interface; otherwise, it comes from the initial data;
	IF new_id IS NULL OR NOT EXISTS (SELECT * FROM maps WHERE id = new_id) THEN

		INSERT INTO maps(
			id,
			code,
			title, 
			description, 
			properties,
			file_id,
			category_id,
			table_name, 
			owner_id
			)
		VALUES (
			COALESCE(new_id, nextval(pg_get_serial_sequence('maps', 'id'))),
			input_row.code, 
			COALESCE(input_row.title, '[]'::jsonb),
			COALESCE(input_row.description, '{}'::jsonb),
			COALESCE(input_row.properties, '{}'::jsonb),
			input_row.file_id,
			input_row.category_id,
			input_row.table_name, 
			input_row.owner_id
			)
		RETURNING 
			*
		INTO STRICT 
			new_row;

		RETURN NEXT new_row;

	ELSE
		current_row.id = new_id;
		current_row.code = '"WARNING: a row with the given id exists already present. Data will not be inserted."';

		RAISE WARNING 'A row with the given id exists already present. Data will not be inserted (id=%)', current_row.id;

		RETURN NEXT current_row;

	END IF;

END LOOP;

RETURN;
END;
$BODY$
LANGUAGE plpgsql;

/*
select * from maps order by id desc

select * from maps_create('[
{
	"code": "precepitacao_ref",
	"title": {"pt": "fwefwef", "en": "fwefwef fewfw"},
	"category_id": 105,
	"owner_id": 2,
	"table_name": "geo.xyz"
}
]')

*/
