-- drop views and functions that depend on the texts table
-- drop view if exists fixed_texts;
-- drop view if exists content_texts;
drop function if exists create_text(_section text, _key text, _data_text text, _data_text_desc text, _author_id int, _active boolean);
drop function if exists update_text(_section text, _key text, _data_text text, _author_id int);
drop view if exists all_texts;


/********
The main texts table
**********/

DROP TABLE IF EXISTS texts;


/*
All the texts in the website are inserted manually. The users are only able to edit (update).
It is not possible to create or delete texts (because the layout of the website is pre-defined).
*/
CREATE TABLE texts( 
	id SERIAL, 
	section TEXT NOT NULL,   -- ?should be unique? should be 'fixed', 'home', 'landing', 'biodiversity', 'general_content', etc
	key TEXT NOT NULL,
	data_text JSON NOT NULL,
	data_text_desc JSON,
	author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL,
	active BOOLEAN,
	last_updated timestamptz not null default now(),
	PRIMARY KEY (section, key)
);
SELECT audit.audit_table('texts');




/**************************
 Get all texts
***************************/



create view all_texts as
	select 
		t.section, 
		t.key, 
		t.data_text, 
		t.data_text_desc, 
		(u.first || ' ' || u.last) as author,
		t.last_updated
	from 
		texts t
		inner join users u
		on t.author_id = u.id
	where
		t.active = true;

select * from all_texts;


/**************************
 Create a new text; the key must not exist (it has UNIQUE constraint). This function
 is only used to seed data 
***************************/

create or replace function create_text(_section text, _key text, _data_text text, _data_text_desc text, _author_id int, _active boolean)
returns texts
as $$
declare 
	new_text texts;
begin

INSERT INTO 
	texts(section, key, data_text, data_text_desc, author_id, active) 
VALUES
	(_section, _key, _data_text::json, _data_text_desc::json, _author_id, _active)
RETURNING 
	*
INTO
	new_text;

RETURN new_text;
	
end;
$$ language plpgsql;


/**************************
 Update a text
***************************/

create or replace function update_text(_section text, _key text, _data_text text, _author_id int)
returns texts
as $$
declare 
	updated_text texts;
begin

UPDATE texts
SET
	section = _section,
	key = _key,
	data_text = _data_text::json,
	last_updated = now()
WHERE
	section = _section and key = _key
RETURNING 
	*
INTO
	updated_text;

RETURN updated_text;
	
end;
$$ language plpgsql;



/**************************
Get all previous versions of the texts relative to the given section/key.
***************************/

drop function if exists get_previous_texts(_section text, _key text);

create or replace function get_previous_texts(_section text, _key text)
returns table(
	old_text text,
	last_updated timestamptz,
	author_id integer
)
as $$
declare 
-- ...
begin

return query
select 
	row_data->'data_text' as old_text, 
	(row_data->'last_updated')::timestamptz as last_updated, 
	(row_data->'author_id')::integer as author_id
from 
	audit.logged_actions
where 
	table_name = 'texts' and row_data->'section' = _section and row_data->'key' = _key
order by 
	row_data->'last_updated' desc;
	
end;
$$ language plpgsql;

/*
select * from fixed_texts;
select * from content_texts;
delete * from texts;


select * from create_text('fixed', 'mainTitle', '{"pt-pt": "Estratégia Regional de Adaptação Face às Alterações Climáticas", "en-gb": "Regional Climate Change Adaptation Strategy"}', '{"pt-pt": "Titulo", "en-gb": ""}', 1);
select * from create_text('fixed', 'readMore', '{"pt-pt": "Ler mais", "en-gb": "Read more"}', NULL, 1);
select * from create_text('fixed', 'userAreaLogin', '{"pt-pt": "Área reservada", "en-gb": "Personal area"}', NULL, 1);
select * from create_text('fixed', 'userAreaLogout', '{"pt-pt": "Sair", "en-gb": "Logout"}', NULL, 1);
select * from create_text('fixed', 'hello', '{"pt-pt": "Olá", "en-gb": "Hello"}', 1);
select * from create_text('fixed', 'search', '{"pt-pt": "Pesquisar na plataforma", "en-gb": "Search in the platform"}', 1);
select * from create_text('fixed', 'menuHome', '{"pt-pt": "Home", "en-gb": "Home"}', NULL, 1);
select * from create_text('fixed', 'menuIntroduction', '{"pt-pt": "Introdução", "en-gb": "Introduction"}', 1);
select * from create_text('fixed', 'menuMap', '{"pt-pt": "Mapa de Vulnerabilidades", "en-gb": "Vulnerabilities map"}', 1);
select * from create_text('fixed', 'menuStrategy', '{"pt-pt": "Estratégia de Adaptação", "en-gb": "Adaptation strategy"}', 1);
select * from create_text('fixed', 'menuPeople', '{"pt-pt": "Equipa", "en-gb": "Team"}', 1);
select * from create_text('fixed', 'informationsFor', '{"pt-pt": "Informações para", "en-gb": "Informations for"}', 1);
select * from create_text('fixed', 'sectors', '{"pt-pt": "Sectores", "en-gb": "Sectors"}', 1);
select * from create_text('fixed', 'open', '{"pt-pt": "Abrir", "en-gb": "Open"}', 1);
select * from create_text('fixed', 'openU', '{"pt-pt": "ABRIR", "en-gb": "OPEN"}', 1);
select * from create_text('fixed', 'moreInfo', '{"pt-pt": "Mais info", "en-gb": "More info"}', 1);
select * from create_text('fixed', 'moreInfoU', '{"pt-pt": "MAIS INFO", "en-gb": "MORE INFO"}', 1);


select * from update_text('fixed', 'mainTitle', '{"pt-pt": "updated3! Estratégia Regional de Adaptação Face às Alterações Climáticas", "en-gb": "Regional Climate Change Adaptation Strategy"}', 2);
select * from update_text('fixed', 'userAreaLogin', '{"pt-pt": "update3 Área reservada", "en-gb": "update3 Personal area"}', 2);
*/

/*
select * from texts;
select * from all_texts;
delete from texts;


select * from get_previous_texts('fixed', 'userAreaLogin');
*/










/**************************
 For a given section and key, get all the texts relative to that key (that is, all the 
 PREVIOUS versions of the texts relative to that section and key)
***************************/

/*
drop function if exists get_text(_section text, _key text);

create or replace function get_text(_section text, _key text)
returns table(key text, data_text json, data_text_description json, author text, last_updated timestamptz)
as $$
declare 
-- ...
begin

return query
	select 
		t.key, 
		t.data_text, 
		t.data_text_description, 
		(u.first || ' ' || u.last),
		t.last_updated
	from 
		texts t
		inner join users u
		on t.author_id = u.id
	where
		t.section = _section and t.key = _key
end;
$$ language plpgsql;
*/


/*
select * from texts order by id desc
select * from get_text('fixed', 'menuHome');
select * from get_text('content', 'biodiversidadeLanding');
*/


/**************************
 Get the latest version of all texts from the section 'fixed'
***************************/
/*
drop view if exists fixed_texts;

create view fixed_texts as
	select distinct on (t.key) 
		t.key, t.data, t.created_at, (u.first || ' ' || u.last) as author
	from 
		texts t
		inner join users u
		on t.author_id = u.id
	where 
		section = 'fixed'
	order by 
		t.key, t.id desc;


select * from fixed_texts;

*/

/**************************
 Get the latest version of all texts from the section 'content'
 (the query is equal to the previous one)
***************************/
/*
drop view if exists content_texts;

create view content_texts as
	select distinct on (t.key) 
		t.key, t.data, t.created_at, (u.first || ' ' || u.last) as author
	from 
		texts t
		inner join users u
		on t.author_id = u.id
	where 
		section = 'content'
	order by 
		t.key, t.id desc;


select * from content_texts;
*/

/*
update texts
set data_text = '{"pt-pt":"Área reservada","en-gb":"Personal area"}'::json
where section = 'fixed' and key='userAreaLogin'

select key, data_text from texts where section = 'fixed'
order by key

select key, data_text from texts where section = 'home'
order by key

select key, data_text, section from texts where section = 'fixed'
order by key

delete from texts
select * from texts
*/
