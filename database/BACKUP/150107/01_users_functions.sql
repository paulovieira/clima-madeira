--select * from users order by id desc;
--delete from users where id >= 3

/*
All functions have the signature (json input_data, json options), except tablename_read_all(json options)
*/



DROP FUNCTION if exists users_read_all(json);


/**************************
 1. Read all rows
**************************/
CREATE OR REPLACE FUNCTION users_read_all(options json DEFAULT '{}')
RETURNS SETOF users AS
$BODY$
BEGIN

IF (options->>'eraseFields')::bool IS TRUE THEN
RETURN QUERY
	SELECT
		id,
		email, 
		first_name, 
		last_name,
		NULL::text AS pw_hash,
		NULL::timestamptz created_at,
		NULL::text AS recover,
		NULL::timestamptz recover_valid_until
	FROM
		users
	ORDER BY
		id;
ELSE
RETURN QUERY
	SELECT
		*
	FROM
		users
	ORDER BY
		id;
END IF;

RETURN;
END;
$BODY$
LANGUAGE plpgsql;

/*
select * from  users_read_all();
select * from  users_read_all('{"eraseFields": true}');
*/






/**************************
 2. Read specific rows based on some custom criteria (which should be given in the input data json);
 The default criteria is: read rows such that the value at the field f is equal to the value given in the input json object 
 (at the respective f field). The field f is not fixed.
*****************************/


DROP FUNCTION if exists users_read(json, json);

CREATE OR REPLACE FUNCTION users_read(input_data json, options json DEFAULT '{}')
RETURNS SETOF users
AS
$BODY$
DECLARE
	input_row users;
	command text;
	multi_criteria BOOL;
BEGIN

FOR input_row IN (select * from json_populate_recordset(null::users, input_data)) LOOP
	multi_criteria := false;

	-- generate a dynamic command: first the base query
	IF (options->>'eraseFields')::bool IS TRUE THEN
		command := 'SELECT
						id,
						email, 
						first_name, 
						last_name,
						NULL::text AS pw_hash,
						NULL::timestamptz created_at,
						NULL::text AS recover,
						NULL::timestamptz recover_valid_until
					FROM users';
	ELSE
		command := 'SELECT * FROM users';
	END IF;


	-- criteria: id
	IF input_row.id IS NOT NULL THEN
		IF multi_criteria = false THEN  command = command || ' WHERE'; multi_criteria := true;
		ELSE command = command || ' AND';
		END IF;

		command = format(command || ' id = %L', input_row.id);
	END IF;
	
	-- criteria: email
	IF input_row.email IS NOT NULL THEN
		IF multi_criteria = false THEN  command = command || ' WHERE'; multi_criteria := true;
		ELSE command = command || ' AND';
		END IF;

		command = format(command || ' email = %L', input_row.email);
	END IF;

	-- criteria: first_name
	IF input_row.first_name IS NOT NULL THEN
		IF multi_criteria = false THEN  command = command || ' WHERE'; multi_criteria := true;
		ELSE command = command || ' AND';
		END IF;

		command = format(command || ' first_name = %L', input_row.first_name);
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
select * from users
select * from  users_read('[{"email":"paulovieira@gmail.com"}, {"id":"2"}]', '{"eraseFields": true }');
select * from  users_read('[{"email":"paulovieira@gmail.com"}, {"id":"2"}]');
select * from  users_read('[{"id":"1"}]');
*/




/**************************
 3. Create rows
**************************/

DROP FUNCTION if exists users_create(json, json);

CREATE OR REPLACE FUNCTION users_create(input_data json, options json DEFAULT '{}')
RETURNS SETOF users AS
$BODY$
DECLARE
	new_row users;
	input_row users;
BEGIN

FOR input_row IN (select * from json_populate_recordset(null::users, input_data)) LOOP
	INSERT INTO users(
		email, 
		first_name, 
		last_name, 
		pw_hash
		)
	VALUES (
		input_row.email, 
		input_row.first_name, 
		input_row.last_name, 
		input_row.pw_hash
		)
	RETURNING 
		*
	INTO STRICT 
		new_row;

	-- optionally erase delicate fields
	IF (options->>'eraseFields')::bool IS TRUE THEN
		new_row.pw_hash = NULL::text;
		new_row.created_at = NULL::timestamptz;
		new_row.recover = NULL::text;
		new_row.recover_valid_until = NULL::timestamptz;
	END IF;
	
	RETURN NEXT new_row;
END LOOP;

RETURN;
END;
$BODY$
LANGUAGE plpgsql;

/*
select * from users order by id desc
delete from users where id >= 244

select * from users_create('[{"first_name": "232", "email": "@232", "pw_hash": ""},{"first_name": "233", "email": "@233", "pw_hash": "dd"}]');




select * from users_create('[
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



DROP FUNCTION if exists users_update(json, json);

CREATE OR REPLACE FUNCTION users_update(input_data json, options json DEFAULT '{}')
RETURNS SETOF users AS
$$
DECLARE
	updated_row users;
	input_row users;
	command text;
BEGIN

FOR input_row IN (select * from json_populate_recordset(null::users, input_data)) LOOP
	-- generate a dynamic command: first the base query
	command := 'UPDATE users SET ';

	-- then add (cumulatively) the fields to be updated; those fields must be present in the input_data json;
	IF input_row.email IS NOT NULL THEN
		command = format(command || 'email = %L, ', input_row.email);
	END IF;
	IF input_row.first_name IS NOT NULL THEN
		command = format(command || 'first_name = %L, ', input_row.first_name);
	END IF;
	IF input_row.last_name IS NOT NULL THEN
		command = format(command || 'last_name = %L, ', input_row.last_name);
	END IF;
	IF input_row.pw_hash IS NOT NULL THEN
		command = format(command || 'pw_hash = %L, ', input_row.pw_hash);
	END IF;
	IF input_row.recover IS NOT NULL THEN
		command = format(command || 'recover = %L, ', input_row.recover);
	END IF;
	IF input_row.recover_valid_until IS NOT NULL THEN
		command = format(command || 'recover_valid_until = %L, ', input_row.recover_valid_until);
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
		updated_row.pw_hash = NULL::text;
		updated_row.created_at = NULL::timestamptz;
		updated_row.recover = NULL::text;
		updated_row.recover_valid_until = NULL::timestamptz;
	END IF;

	RETURN NEXT 
		updated_row;
END LOOP;

RETURN;
END;
$$
LANGUAGE plpgsql;


/*
select * from users order by id desc

select * from users_update('[{"id": "237", "email": "@237-2"}]', '{"eraseFields": true}');
select * from users_update('[{"id": "237", "email": "@237-5", "first_name": "237-3"}]');
select * from users_update('[{"id": "2370", "email": "@237-6", "recover": "zzz"}]', '{"eraseFields": true}');

select * from users_update('[
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



DROP FUNCTION if exists users_delete(json, json);

CREATE OR REPLACE FUNCTION users_delete(input_data json, options json DEFAULT '{}')
RETURNS TABLE(deleted_id int) AS
$$
DECLARE
	deleted_row users;
	input_row users;
BEGIN

FOR input_row IN (select * from json_populate_recordset(null::users, input_data)) LOOP
	DELETE FROM 
		users
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

select * from users order by id desc;
insert into users(first,email,pw_hash) values ('qwe', 'qwe', 'qwe'), ('qwe2', 'qwe2', 'qwe2')

select * from users_delete('[{"id": 253}, {"id": 253}]', '{"eraseFields": true}');
select * from users_delete('[{"id": 13}]');
*/




