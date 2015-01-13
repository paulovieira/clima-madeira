DROP TABLE IF EXISTS texts CASCADE;

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

