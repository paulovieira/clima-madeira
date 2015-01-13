--select * from groups order by id desc;
--delete from groups where id >= 3

/*
All functions have the signature (json input_data, json options), except tablename_read_all(json options)
*/



DROP FUNCTION if exists groups_read_all(json);


/**************************
 1. Read all rows
**************************/
CREATE OR REPLACE FUNCTION groups_read_all(options json DEFAULT '{}')
RETURNS SETOF groups AS
$BODY$
BEGIN

IF (options->>'eraseFields')::bool IS TRUE THEN
RETURN QUERY
	SELECT
		id,
		code, 
		name
	FROM
		groups
	ORDER BY
		id;
ELSE
RETURN QUERY
	SELECT
		*
	FROM
		groups
	ORDER BY
		id;
END IF;

RETURN;
END;
$BODY$
LANGUAGE plpgsql;

/*
select * from  groups_read_all();
select * from  groups_read_all('{"eraseFields": true}');
*/






/**************************
 2. Read specific rows based on some custom criteria (which should be given in the input data json);
 The default criteria is: read rows such that the value at the field f is equal to the value given in the input json object 
 (at the respective f field). The field f is not fixed.
*****************************/


DROP FUNCTION if exists groups_read(json, json);

CREATE OR REPLACE FUNCTION groups_read(input_data json, options json DEFAULT '{}')
RETURNS SETOF groups
AS
$BODY$
DECLARE
	input_row groups;
	command text;
	multi_criteria BOOL;
BEGIN

FOR input_row IN (select * from json_populate_recordset(null::groups, input_data)) LOOP
	multi_criteria := false;

	-- generate a dynamic command: first the base query
	IF (options->>'eraseFields')::bool IS TRUE THEN
		command := 'SELECT
						id,
						code, 
						name
					FROM groups';
	ELSE
		command := 'SELECT * FROM groups';
	END IF;


	-- criteria: id
	IF input_row.id IS NOT NULL THEN
		IF multi_criteria = false THEN  command = command || ' WHERE'; multi_criteria := true;
		ELSE command = command || ' AND';
		END IF;

		command = format(command || ' id = %L', input_row.id);
	END IF;
	
	-- criteria: code
	IF input_row.code IS NOT NULL THEN
		IF multi_criteria = false THEN  command = command || ' WHERE'; multi_criteria := true;
		ELSE command = command || ' AND';
		END IF;

		command = format(command || ' code = %L', input_row.code);
	END IF;

	-- criteria: name
	IF input_row.name IS NOT NULL THEN
		IF multi_criteria = false THEN  command = command || ' WHERE'; multi_criteria := true;
		ELSE command = command || ' AND';
		END IF;

		command = format(command || ' name = %L', input_row.name);
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
select * from groups

select * from  groups_read('[{"id":"1"}]');
select * from  groups_read('[{"id":"1"}]', '{"eraseFields": true }');
*/




/**************************
 3. Create rows
**************************/

DROP FUNCTION if exists groups_create(json, json);

CREATE OR REPLACE FUNCTION groups_create(input_data json, options json DEFAULT '{}')
RETURNS SETOF groups AS
$BODY$
DECLARE
	new_row groups;
	input_row groups;
BEGIN

FOR input_row IN (select * from json_populate_recordset(null::groups, input_data)) LOOP
	INSERT INTO groups(
		code, 
		name
		)
	VALUES (
		input_row.code, 
		input_row.name
		)
	RETURNING 
		*
	INTO STRICT 
		new_row;

	-- optionally erase delicate fields
	IF (options->>'eraseFields')::bool IS TRUE THEN
		-- noop
	END IF;
	
	RETURN NEXT new_row;
END LOOP;

RETURN;
END;
$BODY$
LANGUAGE plpgsql;

/*
select * from groups order by id desc
delete from groups where id >= 244

select * from groups_create('[{"name": "admin", "code": 99},{"name": "energia", "code": 1},{"name": "biodiversidade", "code": 2}]');




select * from groups_create('[
{"email": "@500", "first_name": "", "pw_hash": ""},
{"email": "@501", "first_name": "", "pw_hash": ""},
{"email": "@502", "first_name": "", "pw_hash": ""},
{"email": "@503", "first_name": "", "pw_hash": ""},
{"email": "@504", "first_name": "", "pw_hash": ""}
]', 
'{"eraseFields": true}'
);


NOTES: some quick benchmarks
insert 5 rows: ~300ms
insert 10 rows: ~700ms
insert 20 rows: ~1400ms
insert 30 rows: ~2100ms (!)

The time is clearly growing linearly;
*/




/**************************
 4. Update rows
**************************/



DROP FUNCTION if exists groups_update(json, json);

CREATE OR REPLACE FUNCTION groups_update(input_data json, options json DEFAULT '{}')
RETURNS SETOF groups AS
$$
DECLARE
	updated_row groups;
	input_row groups;
	command text;
BEGIN

FOR input_row IN (select * from json_populate_recordset(null::groups, input_data)) LOOP
	-- generate a dynamic command: first the base query
	command := 'UPDATE groups SET ';

	-- then add (cumulatively) the fields to be updated; those fields must be present in the input_data json;
	IF input_row.code IS NOT NULL THEN
		command = format(command || 'code = %L, ', input_row.code);
	END IF;
	IF input_row.name IS NOT NULL THEN
		command = format(command || 'name = %L, ', input_row.name);
	END IF;

	-- remove the comma and space from the last if
	command = left(command, -2);
	command = format(command || ' WHERE id = %L RETURNING *;', input_row.id);

	--RAISE NOTICE 'Dynamic command: %', command;

	EXECUTE 
		command

	INTO STRICT
		updated_row;

	-- optionally erase delicate fields
	IF (options->>'eraseFields')::bool IS TRUE THEN
		-- noop
	END IF;

	RETURN NEXT 
		updated_row;
END LOOP;

RETURN;
END;
$$
LANGUAGE plpgsql;


/*
select * from groups order by id desc

select * from groups_update('[{"id": "237", "email": "@237-2"}]', '{"eraseFields": true}');
select * from groups_update('[{"id": "237", "email": "@237-5", "first_name": "237-3"}]');
select * from groups_update('[{"id": "2370", "email": "@237-6", "recover": "zzz"}]', '{"eraseFields": true}');

select * from groups_update('[
{"id": "400", "email": "@400-#8", "recover": "#8"},
{"id": "401", "email": "@401-#8", "recover": "#8"},
{"id": "402", "email": "@402-#8", "recover": "#8"},
{"id": "403", "email": "@403-#8", "recover": "#8"},
{"id": "404", "email": "@404-#8", "recover": "#8"},
]', '{"eraseFields": true}');


NOTES: results from a quick benchmark:
Update 5 rows: 30ms
Update 10 rows: 40ms
Update 20 rows: 40ms
Update 30 rows: 40ms

(the number of rows doesn't seem to matter much)
*/






/**************************
 4. delete rows
**************************/



DROP FUNCTION if exists groups_delete(json, json);

CREATE OR REPLACE FUNCTION groups_delete(input_data json, options json DEFAULT '{}')
RETURNS TABLE(deleted_id int) AS
$$
DECLARE
	deleted_row groups;
	input_row groups;
BEGIN

FOR input_row IN (select * from json_populate_recordset(null::groups, input_data)) LOOP
	DELETE FROM 
		groups
	WHERE 
		id = input_row.id
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

select * from groups order by id desc;
insert into groups(first,email,pw_hash) values ('qwe', 'qwe', 'qwe'), ('qwe2', 'qwe2', 'qwe2')

select * from groups_delete('[{"id": 253}, {"id": 253}]', '{"eraseFields": true}');
select * from groups_delete('[{"id": 13}]');
*/




