--select * from texts order by id desc;
--delete from texts where id >= 3

/*
All functions have the signature (json input_data, json options), except tablename_read_all(json options)
*/



DROP FUNCTION if exists texts_read_all(json);


/**************************
 1. Read all rows
**************************/
CREATE OR REPLACE FUNCTION texts_read_all(options json DEFAULT '{}')
RETURNS SETOF texts AS
$BODY$
BEGIN

RETURN QUERY
	SELECT
		*
	FROM
		texts
	ORDER BY
		id;

RETURN;
END;
$BODY$
LANGUAGE plpgsql;

/*
select * from  texts_read_all();
*/






/**************************
 2. Read specific rows based on some custom criteria (which should be given in the input data json);
 The default criteria is: read rows such that the value at the field f is equal to the value given in the input json object 
 (at the respective f field). The field f is not fixed.
*****************************/


DROP FUNCTION if exists texts_read(json);

CREATE OR REPLACE FUNCTION texts_read(options json DEFAULT '[{}]')

-- definition of the users table + extra data from the join
RETURNS TABLE(
	id INT,
	tags JSONB,
	contents JSONB,
	contents_desc JSONB,
	author_id INT,
	active BOOL,	
	last_updated timestamptz,
	author_data JSON)
AS
$BODY$

DECLARE
	options_row RECORD;
	command text;
	multi_criteria BOOL;
BEGIN

FOR options_row IN (
				-- allowed criteria keys in the input json objects
				select * from json_to_recordset(options) as _dummy_input(
									id INT,
									author_id INT,
									author_email TEXT,
									tag TEXT,
									active BOOLEAN) 
				) LOOP

	command := 'SELECT 
			t.*, 
			(select row_to_json(_dummy_) from (select u.*) as _dummy_) as author_data
		FROM texts t 
		INNER JOIN users u
		ON t.author_id = u.id';

	multi_criteria := false;
	
	-- criteria: id
	IF options_row.id IS NOT NULL THEN
		IF multi_criteria = false THEN  command = command || ' WHERE'; multi_criteria := true;
		ELSE command = command || ' AND';
		END IF;

		command = format(command || ' t.id = %L::int', options_row.id);
	END IF;

	-- criteria: author_id
	IF options_row.author_id IS NOT NULL THEN
		IF multi_criteria = false THEN  command = command || ' WHERE'; multi_criteria := true;
		ELSE command = command || ' AND';
		END IF;

		command = format(command || ' t.author_id = %L::int', options_row.author_id);
	END IF;

	-- criteria: author_email
	IF options_row.author_email IS NOT NULL THEN
		IF multi_criteria = false THEN  command = command || ' WHERE'; multi_criteria := true;
		ELSE command = command || ' AND';
		END IF;

		command = format(command || ' u.email = %L', options_row.author_email);
	END IF;

	-- criteria: tag
	IF options_row.tag IS NOT NULL THEN
		IF multi_criteria = false THEN  command = command || ' WHERE'; multi_criteria := true;
		ELSE command = command || ' AND';
		END IF;

		command = format(command || ' t.tags ?| ARRAY[%L]', options_row.tag);
	END IF;
	
	-- criteria: active
	IF options_row.active IS NOT NULL THEN
		IF multi_criteria = false THEN  command = command || ' WHERE'; multi_criteria := true;
		ELSE command = command || ' AND';
		END IF;

		command = format(command || ' t.active = %L::bool', options_row.active);
	END IF;

	command := command || ';';

	RETURN QUERY EXECUTE 
		command;

END LOOP;
		
RETURN;
END;
$BODY$
LANGUAGE plpgsql;


/*
select * from texts

select * from texts_read('[{}]');
select * from texts_read('[{"tag": "tag1"}]');
select * from  texts_read('[{"email":"paulovieira@gmail.com"}, {"id":"2"}]');
select * from  texts_read('[{"id":"1"}]');

*/




/**************************
 3. Create rows
**************************/

DROP FUNCTION IF EXISTS texts_create(json, json);

CREATE OR REPLACE FUNCTION texts_create(input_data json, options json DEFAULT '[{}]')
RETURNS SETOF texts AS
$BODY$
DECLARE
	new_row texts;
	input_row texts;
BEGIN

FOR input_row IN (
			select * from json_populate_recordset(null::texts, input_data)
				) LOOP

	INSERT INTO texts(
		tags, 
		contents, 
		contents_desc, 
		author_id
		)
	VALUES (
		input_row.tags, 
		input_row.contents, 
		input_row.contents_desc, 
		input_row.author_id
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
select * from texts order by id desc

select * from texts_create('[
{
	"tags": ["tag3", "tag4"],
	"contents": {"pt": "fwefwef", "en": "fwefwef fewfw"},
	"author_id": 2
}
]')

*/




/**************************
 4. Update rows
**************************/



DROP FUNCTION if exists texts_update(json, json);

CREATE OR REPLACE FUNCTION texts_update(input_data json, options json DEFAULT '{}')
RETURNS SETOF texts AS
$$
DECLARE
	updated_row texts;
	input_row texts;
	command text;
BEGIN

FOR input_row IN (
				select * from json_populate_recordset(null::texts, input_data)
				) LOOP
	-- generate a dynamic command: first the base query
	command := 'UPDATE texts SET ';

	command = format(command || 'last_updated = %L, ', now());

	-- then add (cumulatively) the fields to be updated; those fields must be present in the input_data json;
	IF input_row.tags IS NOT NULL THEN
		command = format(command || 'tags = %L, ', input_row.tags);
	END IF;
	IF input_row.contents IS NOT NULL THEN
		command = format(command || 'contents = %L, ', input_row.contents);
	END IF;
	IF input_row.contents_desc IS NOT NULL THEN
		command = format(command || 'contents_desc = %L, ', input_row.contents_desc);
	END IF;
	IF input_row.author_id IS NOT NULL THEN
		command = format(command || 'author_id = %L, ', input_row.author_id);
	END IF;
	IF input_row.active IS NOT NULL THEN
		command = format(command || 'active = %L, ', input_row.active);
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
select * from texts order by id desc

select * from texts_update('[{"id": 1, "tags": ["tag5"]}]');
select * from texts_update('[{"id": 1, "tags": ["tag7"], "contents": {"pt": "xxx"}}]');

*/






/**************************
 4. delete rows
**************************/



DROP FUNCTION if exists texts_delete(json);

CREATE OR REPLACE FUNCTION texts_delete(options json DEFAULT '[{"id": 0}]')
RETURNS TABLE(deleted_id int) AS
$$
DECLARE
	deleted_row texts;
	options_row texts;
BEGIN

FOR options_row IN (select * from json_populate_recordset(null::texts, options)) LOOP
	DELETE FROM 
		texts
	WHERE 
		id = options_row.id
	RETURNING
		*
	INTO STRICT
		deleted_row;

	deleted_id := deleted_row.id;

	RETURN NEXT;
END LOOP;

RETURN;
END;
$$
LANGUAGE plpgsql;


/*

select * from texts order by id desc;

select * from texts_delete('[{"id": 253}, {"id": 253}]');
select * from texts_delete('[{"id": 13}]');
*/




