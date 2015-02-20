
create table users_groups(
	id         serial,
	user_id    int references users(id)    on update cascade on delete cascade,
	group_code int references groups(code) on update cascade on delete cascade,
	primary key(user_id, group_code)
);
SELECT audit.audit_table('users_groups');

-- todo: create index?

--select * from users_groups order by id desc;
--delete from users_groups where id >= 3


/*

	1. READ

*/


DROP FUNCTION if exists users_groups_read(json);

CREATE OR REPLACE FUNCTION users_groups_read(options json DEFAULT '[{}]')

-- return table using the definition of the users_groups table
RETURNS TABLE(
	id         INT,
	user_id    INT,
	group_code INT
)
AS
$BODY$

DECLARE
	options_row json;
	command text;
	number_conditions INT;

	-- fields to be used in WHERE clause
	user_id INT;
	group_code TEXT;
BEGIN


FOR options_row IN ( select json_array_elements(options) ) LOOP

	command := 'SELECT * FROM users_groups ';
			
	-- extract values to be (optionally) used in the WHERE clause
	SELECT json_extract_path_text(options_row, 'user_id')     INTO user_id;
	SELECT json_extract_path_text(options_row, 'group_code')  INTO group_code;

	number_conditions := 0;
	
	-- criteria: user_id
	IF user_id IS NOT NULL THEN
		IF number_conditions = 0 THEN  command = command || ' WHERE';  
		ELSE                           command = command || ' AND';
		END IF;

		command = format(command || ' user_id = %L', user_id);
		number_conditions := number_conditions + 1;
	END IF;

	-- criteria: group_code
	IF group_code IS NOT NULL THEN
		IF number_conditions = 0 THEN  command = command || ' WHERE';  
		ELSE                           command = command || ' AND';
		END IF;

		command = format(command || ' group_code = %L', group_code);
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
select * from users_groups

select * from  users_groups_read('[{}]');
select * from  users_groups_read('[{"group_code": 99, "user_id": 1}]');
select * from  users_groups_read('[{"user_id":"1"}, {"user_id":"2"}]');

*/




/*

	2. CREATE

*/

DROP FUNCTION if exists users_groups_create(json, json);

CREATE OR REPLACE FUNCTION users_groups_create(input_data json, options json DEFAULT '[{}]')
RETURNS SETOF users_groups AS
$BODY$
DECLARE
	new_row users_groups%ROWTYPE;
	input_row users_groups%ROWTYPE;
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




/*

	3. UPDATE

*/


DROP FUNCTION if exists users_groups_update(json, json);

CREATE OR REPLACE FUNCTION users_groups_update(input_data json, options json DEFAULT '[{}]')
RETURNS SETOF users_groups AS
$$
DECLARE
	updated_row users_groups%ROWTYPE;
	input_row users_groups%ROWTYPE;
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





/*

	4. DELETE

*/

CREATE OR REPLACE FUNCTION users_groups_delete(options json DEFAULT '[{}]')
RETURNS TABLE(deleted_id int) AS
$$
DECLARE
	deleted_row users_groups%ROWTYPE;
	options_row JSON;

	-- fields to be used in WHERE clause
	id_to_delete INT;
BEGIN

FOR options_row IN ( select json_array_elements(options) ) LOOP

	-- extract values to be (optionally) used in the WHERE clause
	SELECT json_extract_path_text(options_row, 'id') INTO id_to_delete;
	
	IF id_to_delete IS NOT NULL THEN
		DELETE FROM users_groups
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

select * from users_groups order by id desc;
select * from users_groups_delete('[{"id": 3}]');
*/



