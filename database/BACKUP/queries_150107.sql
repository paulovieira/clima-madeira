--select * from groups
--select * from users_groups

select * from texts

select 
	u.id,
--	json_agg(g.*) as user_groups,
	g.*
--	json_agg(t.*) as user_texts
--	t.*
from users u 
inner join users_groups ug on u.id          = ug.user_id
inner join groups       g  on ug.group_code = g.code
--inner join texts        t  on u.id = t.author_id
group by u.id
order by u.id

IDEIA: fazer queries à parte (CTE) apenas com (id, json); depois fazer um join com essas CTE



select 
	u.*,
	json_agg(t.*) as user_texts
	--t.*
from users u 
inner join texts       t  on t.author_id = u.id
group by u.id
order by u.id






select json_agg(row)
from (
	select id, first_name from users
) as row





select 
row_to_json
	u.id as user_id,
	g.*
from users u 
inner join users_groups ug on u.id          = ug.user_id
inner join groups       g  on ug.group_code = g.code
where user_id = 1




select 
	g.*
from users u 
inner join users_groups ug on u.id          = ug.user_id
where u.id = 1




select * from users
select * from groups
select * from users_groups
select * from texts


/*
a user
	-has many texts (because texts has a reference to user.id, so we get a 1-to-many from users to texts)
	-has many groups (because we have a many-to-many relating users and groups, thanks to the link table)

so we want to return all the fields in the user table + a json array of objects relative to all the texts and all the groups related to this user

We use two CTEs with 2 fields: 
	-the user id
	-a json array of objects relative to all the texts that are related to the user (possibly empty)

	-the user id
	-a json array of objects relative to all the groups that are related to the user (possibly empty)

*/

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
),
users_groups_cte as (
	select 
		u.id as user_id,
		json_agg(
			json_build_object(
				'code', g.code, 
				'name', g.name
			)

		) as user_groups
		
	from users u
	left join users_groups ug
		on ug.user_id = u.id
	left join groups g
		on g.code = ug.group_code
	group by u.id
)
 
select 
	u.*, 
	ut.user_texts,
	ug.user_groups
from users u
inner join users_texts_cte ut
	on u.id = ut.user_id
inner join users_groups_cte ug
	on u.id = ug.user_id
where true







/*
a group
	-has many users (because we have a many-to-many relating users and groups, thanks to the link table)

We use a CTE with 2 fields: 
	- the group code
	-a json array of objects relative to all the users that are related to the group (possibly empty)
	
*/
select * from users
 
with group_users_cte as (
	select 
		g.code as group_code,
		json_agg( 
			json_build_object(
				'id', u.id, 
				'email', u.email, 
				'first_name', u.first_name, 
				'last_name', u.last_name
			)
		) as group_users

	from groups g
	left join users_groups ug
		on ug.group_code = g.code
	left join users u
		on u.id = ug.user_id
	group by g.code
)
 
select 
	g.*,
	gu.group_users
from groups g
inner join group_users_cte gu
	on g.code = gu.group_code
where true






DROP FUNCTION if exists loop_json(json);

CREATE OR REPLACE FUNCTION loop_json(options json DEFAULT '[{}]')
RETURNS setof void
AS
$BODY$

DECLARE
	options_row json;
	command text;
	name text;
	email text;
	id int;
BEGIN

	for options_row in ( select json_array_elements(options) ) loop

		select json_extract_path_text(options_row, 'name') into name;
		select json_extract_path_text(options_row, 'email') into email;
		select json_extract_path_text(options_row, 'id') into id;
		
		command := 'UPDATE texts SET ';

		IF name IS NOT NULL THEN
			command = format(command || 'name = %L, ', name);
		END IF;
		IF email IS NOT NULL THEN
			command = format(command || 'email = %L, ', email);
		END IF;

		command = left(command, -2);
		command = format(command || ' WHERE id = %L RETURNING *;', id::int);

		raise notice 'command: %', command;
	
	end loop;
	
END;

$BODY$
LANGUAGE plpgsql;


select * from  users_read('[{"email":"paulovieira@gmail.com"}]');


select loop_json('[{"id":10, "name":"paulo"}, {"id":11, "name":"ana"}]');



select json_array_elements('[{"id":10, "name":"paulo"}, {"id":11, "name":"ana"}]')

select json_each('[{"id":10, "name":"paulo"}, {"id":11, "name":"ana"}]')

select json_extract_path('{"id":10, "name":"paulo"}', 'name') into 

select array('id')::text[]

select '{id}'::text[]