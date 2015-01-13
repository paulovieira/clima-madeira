--select * from users_groups order by id desc;
--delete from users_groups where id >= 3

/*
All functions have the signature (json input_data, json options), except tablename_read_all(json options)
*/



DROP FUNCTION if exists users_groups_read_all(json);


/**************************
 1. Read all rows
**************************/
CREATE OR REPLACE FUNCTION users_groups_read_all(options json DEFAULT '[{}]')
RETURNS SETOF users_groups AS
$BODY$
BEGIN

RETURN QUERY
	SELECT
		*
	FROM
		users_groups
	ORDER BY
		id;

RETURN;
END;
$BODY$
LANGUAGE plpgsql;

/*
select * from  users_groups_read_all();
select * from  users_groups_read_all();
*/






/**************************
 2. Read specific rows based on some custom criteria (which should be given in the input data json);
 The default criteria is: read rows such that the value at the field f is equal to the value given in the input json object 
 (at the respective f field). The field f is not fixed.
*****************************/


DROP FUNCTION if exists users_groups_read(json);

CREATE OR REPLACE FUNCTION users_groups_read(options json DEFAULT '[{}]')
RETURNS SETOF users_groups
AS
$BODY$
DECLARE
	options_row users_groups;
	command text;
	multi_criteria BOOL;
BEGIN

FOR options_row IN (select * from json_populate_recordset(null::users_groups, options)) LOOP
	multi_criteria := false;

	-- generate a dynamic command: first the base query
	command := 'SELECT * FROM users_groups';

	-- criteria: id
	IF options_row.id IS NOT NULL THEN
		IF multi_criteria = false THEN  command = command || ' WHERE'; multi_criteria := true;
		ELSE command = command || ' AND';
		END IF;

		command = format(command || ' id = %L', options_row.id);
	END IF;

	-- criteria: user_id
	IF options_row.user_id IS NOT NULL THEN
		IF multi_criteria = false THEN  command = command || ' WHERE'; multi_criteria := true;
		ELSE command = command || ' AND';
		END IF;

		command = format(command || ' user_id = %L', options_row.user_id);
	END IF;

	-- criteria: group_code
	IF options_row.group_code IS NOT NULL THEN
		IF multi_criteria = false THEN  command = command || ' WHERE'; multi_criteria := true;
		ELSE command = command || ' AND';
		END IF;

		command = format(command || ' group_code = %L', options_row.group_code);
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
select * from users_groups

select * from  users_groups_read('[{"id":"2"}, {"id":"4"}]');

select * from  users_groups_read('[{"user_id":"41", "id":2}]');
select * from  users_groups_read('[{"user_id":"41"}]');
*/




/**************************
 3. Create rows
**************************/

DROP FUNCTION if exists users_groups_create(json, json);

CREATE OR REPLACE FUNCTION users_groups_create(input_data json, options json DEFAULT '[{}]')
RETURNS SETOF users_groups AS
$BODY$
DECLARE
	new_row users_groups;
	input_row users_groups;
BEGIN

FOR input_row IN (select * from json_populate_recordset(null::users_groups, input_data)) LOOP
	INSERT INTO users_groups(
		group_code, 
		user_id
		)
	VALUES (
		input_row.group_code, 
		input_row.user_id
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
select * from users_groups order by id desc

select * from users_groups_create('[{"user_id": 40, "group_code": 25}]');

select * from users_groups_create('[
	{"user_id": 41, "group_code": 1}, 
	{"user_id": 41, "group_code": 2}
]');


*/




/**************************
 4. Update rows
**************************/



DROP FUNCTION if exists users_groups_update(json, json);

CREATE OR REPLACE FUNCTION users_groups_update(input_data json, options json DEFAULT '[{}]')
RETURNS SETOF users_groups AS
$$
DECLARE
	updated_row users_groups;
	input_row users_groups;
	command text;
BEGIN

FOR input_row IN (select * from json_populate_recordset(null::users_groups, input_data)) LOOP
	-- generate a dynamic command: first the base query
	command := 'UPDATE users_groups SET ';

	-- then add (cumulatively) the fields to be updated; those fields must be present in the input_data json;
	IF input_row.group_code IS NOT NULL THEN
		command = format(command || 'group_code = %L, ', input_row.group_code);
	END IF;
	IF input_row.user_id IS NOT NULL THEN
		command = format(command || 'user_id = %L, ', input_row.user_id);
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
select * from users_groups order by id desc


select * from users_groups_update('[
	{"id": "2", "user_id": 41},
	{"id": "3", "user_id": 40}
]');


*/






/**************************
 4. delete rows
**************************/



DROP FUNCTION if exists users_groups_delete(json);

CREATE OR REPLACE FUNCTION users_groups_delete(options json DEFAULT '[{}]')
RETURNS TABLE(deleted_id int) AS
$$
DECLARE
	deleted_row users_groups;
	options_row users_groups;
BEGIN

FOR options_row IN (select * from json_populate_recordset(null::users_groups, options)) LOOP
	DELETE FROM 
		users_groups
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

select * from users_groups order by id desc;
select * from users_groups_delete('[{"id": 3}]');
*/



