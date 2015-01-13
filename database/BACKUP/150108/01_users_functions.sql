--select * from users order by id desc;
--delete from users where id >= 3

/*
All functions have the signature (json options), except:
	- tablename_create(json input_data, json options)
	- tablename_update(json input_data, json options)
*/



DROP FUNCTION if exists users_read_all(json);


/**************************
 1. Read all rows
**************************/
CREATE OR REPLACE FUNCTION users_read_all(options json DEFAULT '[{}]')
RETURNS SETOF users AS
$BODY$
BEGIN

RETURN QUERY
	SELECT
		*
	FROM
		users
	ORDER BY
		id;

RETURN;
END;
$BODY$
LANGUAGE plpgsql;

/*
select * from  users_read_all();
*/






/**************************
 2. Read specific rows based on some custom criteria (which should be given in the input data json);
 The default criteria is: read rows such that the value at the field f is equal to the value given in the input json object 
 (at the respective f field). The field f is not fixed.
*****************************/


DROP FUNCTION if exists users_read(json);

CREATE OR REPLACE FUNCTION users_read(options json DEFAULT '[{}]')
--RETURNS SETOF users
-- definition of the users table + extra data from the join
RETURNS TABLE(
	id INT,
	email TEXT,
	first_name TEXT,
	last_name TEXT,
	pw_hash TEXT,
	created_at timestamptz,
	recover TEXT,
	recover_valid_until timestamptz,
	groups JSON)
AS
$BODY$

DECLARE
	options_row users;
	command text;
	multi_criteria BOOL;
BEGIN

FOR options_row IN (
				select * from json_populate_recordset(null::users, options)
				) LOOP
	multi_criteria := false;

	command := 'SELECT * FROM users';

	-- criteria: id
	IF options_row.id IS NOT NULL THEN
		IF multi_criteria = false THEN  command = command || ' WHERE'; multi_criteria := true;
		ELSE command = command || ' AND';
		END IF;

		command = format(command || ' id = %L::int', options_row.id);
	END IF;
	
	-- criteria: email
	IF options_row.email IS NOT NULL THEN
		IF multi_criteria = false THEN  command = command || ' WHERE'; multi_criteria := true;
		ELSE command = command || ' AND';
		END IF;

		command = format(command || ' email = %L::text', options_row.email);
	END IF;

	-- criteria: first_name
	IF options_row.first_name IS NOT NULL THEN
		IF multi_criteria = false THEN  command = command || ' WHERE'; multi_criteria := true;
		ELSE command = command || ' AND';
		END IF;

		options_row.first_name := '%' || options_row.first_name || '%';
		command = format(command || ' first_name LIKE %L', options_row.first_name);
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
select * from  users_read('[{"email":"paulovieira@gmail.com"}, {"id":"2"}]');
select * from  users_read('[{"email":"paulovieira@gmail.com"}, {"id":"2"}]');
select * from  users_read('[{"id":"1"}]');
*/





-- NEW VERSION

DROP FUNCTION if exists users_read(json);

CREATE OR REPLACE FUNCTION users_read(options json DEFAULT '[{}]')
--RETURNS SETOF users
-- definition of the users table + extra data from the join
RETURNS TABLE(
	id INT,
	email TEXT,
	first_name TEXT,
	last_name TEXT,
	pw_hash TEXT,
	created_at timestamptz,
	recover TEXT,
	recover_valid_until timestamptz,
	user_texts JSON)
AS
$BODY$

DECLARE
	options_row users;
	command text;
	multi_criteria BOOL;
BEGIN

FOR options_row IN (
				select * from json_populate_recordset(null::users, options)
				) LOOP
	multi_criteria := false;


	with users_texts_cte as (
		select 
			u.id as user_id,
			json_agg(
				json_build_object(
					'author_id', t.author_id, 
					'id', t.id, 
					'contents', t.contents, 
					'tags', t.tags
				)

			) as user_texts
						
		from users u
		left join texts t
			on t.author_id = u.id
		group by u.id
	)





	command := 'SELECT u.*, ut.user_texts 
				FROM users u
				INNER JOIN users_texts_cte ut
					ON u.id = ut.user_id';

	-- criteria: id
	IF options_row.id IS NOT NULL THEN
		IF multi_criteria = false THEN  command = command || ' WHERE'; multi_criteria := true;
		ELSE command = command || ' AND';
		END IF;

		command = format(command || ' u.id = %L::int', options_row.id);
	END IF;
	
	-- criteria: email
	IF options_row.email IS NOT NULL THEN
		IF multi_criteria = false THEN  command = command || ' WHERE'; multi_criteria := true;
		ELSE command = command || ' AND';
		END IF;

		command = format(command || ' u.email = %L::text', options_row.email);
	END IF;

	-- criteria: first_name
	IF options_row.first_name IS NOT NULL THEN
		IF multi_criteria = false THEN  command = command || ' WHERE'; multi_criteria := true;
		ELSE command = command || ' AND';
		END IF;

		options_row.first_name := '%' || options_row.first_name || '%';
		command = format(command || ' u.first_name LIKE %L', options_row.first_name);
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
select * from  users_read('[{"email":"paulovieira@gmail.com"}]');
select * from  users_read('[{"email":"paulovieira@gmail.com"}, {"id":"2"}]');
select * from  users_read('[{"id":"1"}]');
*/

/**************************
 3. Create rows
**************************/

DROP FUNCTION if exists users_create(json, json);

CREATE OR REPLACE FUNCTION users_create(input_data json, options json DEFAULT '[{}]')
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
]'
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

CREATE OR REPLACE FUNCTION users_update(input_data json, options json DEFAULT '[{}]')
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

	RETURN NEXT 
		updated_row;
END LOOP;

RETURN;
END;
$$
LANGUAGE plpgsql;


/*
select * from users order by id desc

select * from users_update('[{"id": "237", "email": "@237-2"}]');
select * from users_update('[{"id": "237", "email": "@237-5", "first_name": "237-3"}]');
select * from users_update('[{"id": "2370", "email": "@237-6", "recover": "zzz"}]');

select * from users_update('[
{"id": "400", "email": "@400-#8", "recover": "#8"},
{"id": "401", "email": "@401-#8", "recover": "#8"},
{"id": "402", "email": "@402-#8", "recover": "#8"},
{"id": "403", "email": "@403-#8", "recover": "#8"},
{"id": "404", "email": "@404-#8", "recover": "#8"},
]');


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



DROP FUNCTION if exists users_delete(json);

CREATE OR REPLACE FUNCTION users_delete(options json DEFAULT '[{}]')
RETURNS TABLE(deleted_id int) AS
$$
DECLARE
	deleted_row users;
	options_row users;
BEGIN

FOR options_row IN (select * from json_populate_recordset(null::users, options)) LOOP
	DELETE FROM 
		users
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

select * from users order by id desc;
insert into users(first,email,pw_hash) values ('qwe', 'qwe', 'qwe'), ('qwe2', 'qwe2', 'qwe2')

select * from users_delete('[{"id": 253}, {"id": 253}]');
select * from users_delete('[{"id": 13}]');
*/




