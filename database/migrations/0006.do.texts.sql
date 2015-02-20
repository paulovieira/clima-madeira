
/*
NOTE: in this table the "id" field is not serial because we need an external identification number for each text (which is used in the rest of the application); after the text has been created this id shouldn't be changed (it is fixed); we might define ranges for different parts of the application:

ids between 300 and 400: user for biodiversity
ids between 400 and 500: user for admin panel
...

if we create texts using the web interface, we must create a backup of the table;
*/

CREATE TABLE texts( 
	id INT PRIMARY KEY,
	tags JSONB,
	contents JSONB NOT NULL,
	contents_desc JSONB,
	author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
	active BOOLEAN DEFAULT TRUE,	
	last_updated timestamptz not null default now()
);
SELECT audit.audit_table('texts');

/*
TODO: when a text is created, we could give the groups that can update the text; this means we have to create a new link table texts_groups.

An alternative (simpler) solution is to create a special group named "can_update_texts". If the user belongs to this group, he can update any text. So the permission is all-or-nothing:

	- if the user can update 1 text, he can update all of them
	- if the user cannot update 1 text, he cannot update any of the others

This way the permission to perform some action will split the set of users in a partition with 2 components:

	- the set of user who CAN change texts (any text)
	- the set of user who CANNOT change texts

That is, the permission if global (all the texts would have the same allowed users).

If we used the link table approach the permission would be more fine grained. We would have:

	- the set of users who can change this particular text (but who might not be able to change other texts)

That is, the permissi would be local (each text would have different allowed users).

*/






--select * from texts order by id desc;
--delete from texts where id >= 3

/*

	1. READ

A text
	- has one user (author)

We return 
	- all the fields in the texts table (the author_id is one of the fields)
	- a json array of objects relative to all the user that is the author (the array will only have 1 object)
*/


DROP FUNCTION if exists texts_read(json);

CREATE OR REPLACE FUNCTION texts_read(options json DEFAULT '[{}]')

-- return table uses the definition of the texts table + extra data from the join
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
	options_row json;
	command text;
	number_conditions INT;

	-- fields to be used in WHERE clause
	id INT;
	author_id INT;
	author_email TEXT;
	tag TEXT;
BEGIN


FOR options_row IN ( select json_array_elements(options) ) LOOP

	command := 'SELECT 
			t.*, 
			(select row_to_json(_dummy_) from (select u.*) as _dummy_) as author_data
		FROM texts t 
		INNER JOIN users u
		ON t.author_id = u.id';
			
	-- extract values to be (optionally) used in the WHERE clause
	SELECT json_extract_path_text(options_row, 'id')           INTO id;
	SELECT json_extract_path_text(options_row, 'author_id')    INTO author_id;
	SELECT json_extract_path_text(options_row, 'author_email') INTO author_email;
	SELECT json_extract_path_text(options_row, 'tag')          INTO tag;

	number_conditions := 0;

	-- criteria: id
	IF id IS NOT NULL THEN
		IF number_conditions = 0 THEN  command = command || ' WHERE';  
		ELSE                           command = command || ' AND';
		END IF;

		command = format(command || ' t.id = %L', id);
		number_conditions := number_conditions + 1;
	END IF;

	-- criteria: author_id
	IF author_id IS NOT NULL THEN
		IF number_conditions = 0 THEN  command = command || ' WHERE';
		ELSE                           command = command || ' AND';
		END IF;

		command = format(command || ' t.author_id = %L', author_id);
		number_conditions := number_conditions + 1;
	END IF;

	-- criteria: author_email
	IF author_email IS NOT NULL THEN
		IF number_conditions = 0 THEN  command = command || ' WHERE';
		ELSE                           command = command || ' AND';
		END IF;

		command = format(command || ' u.email = %L', author_email);
		number_conditions := number_conditions + 1;
	END IF;

	-- criteria: tag
	IF tag IS NOT NULL THEN
		IF number_conditions = 0 THEN  command = command || ' WHERE';
		ELSE                           command = command || ' AND';
		END IF;

		command = format(command || ' t.tags ?| ARRAY[%L]', tag);
		number_conditions := number_conditions + 1;
	END IF;

	
	command := command || ' ORDER BY t.id;';

	RETURN QUERY EXECUTE command;

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




/*

	2. CREATE

*/

DROP FUNCTION IF EXISTS texts_create(json, json);

CREATE OR REPLACE FUNCTION texts_create(input_data json, options json DEFAULT '[{}]')
RETURNS SETOF texts AS
$BODY$
DECLARE
	new_row texts%ROWTYPE;
	input_row texts%ROWTYPE;

	new_id INT;
BEGIN

FOR input_row IN (select * from json_populate_recordset(null::texts, input_data)) LOOP

	-- if an id has not been given, we have to explicitely find one
	SELECT input_row.id INTO new_id;
	IF new_id IS NULL THEN   
		SELECT COALESCE(max(id)+1, 1) FROM texts INTO new_id;   -- max(id) will return null if the table is empty
	END IF;

	INSERT INTO texts(
		id,
		tags, 
		contents, 
		contents_desc, 
		author_id
		)
	VALUES (
		new_id,
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



/*

	3. UPDATE

*/

DROP FUNCTION if exists texts_update(json, json);

CREATE OR REPLACE FUNCTION texts_update(input_data json, options json DEFAULT '[{}]')
RETURNS SETOF texts AS
$$
DECLARE
	updated_row texts%ROWTYPE;
	input_row texts%ROWTYPE;
	command text;
BEGIN

FOR input_row IN (select * from json_populate_recordset(null::texts, input_data)) LOOP

	-- generate a dynamic command: first the base query
	command := 'UPDATE texts SET ';

	-- first use the fields that will always be updated
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
/*
	IF input_row.active IS NOT NULL THEN
		command = format(command || 'active = %L, ', input_row.active);
	END IF;
*/

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






/*

	4. DELETE

*/

DROP FUNCTION if exists texts_delete(json);

CREATE OR REPLACE FUNCTION texts_delete(options json DEFAULT '[{}]')
RETURNS TABLE(deleted_id int) AS
$$
DECLARE
	deleted_row texts%ROWTYPE;
	options_row JSON;

	-- fields to be used in WHERE clause
	id_to_delete INT;
BEGIN

FOR options_row IN ( select json_array_elements(options) ) LOOP

	-- extract values to be (optionally) used in the WHERE clause
	SELECT json_extract_path_text(options_row, 'id') INTO id_to_delete;
	
	IF id_to_delete IS NOT NULL THEN
		DELETE FROM texts
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

select * from texts order by id desc;

select * from texts_delete('[{"id": 253}, {"id": 253}]');
select * from texts_delete('[{"id": 13}]');
*/




