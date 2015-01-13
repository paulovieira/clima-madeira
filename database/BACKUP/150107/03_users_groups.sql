
drop table if exists users_groups cascade;

create table users_groups(
	id         serial,
	user_id    int not null references users(id)    on delete cascade,
	group_code int not null references groups(code) on delete cascade,
	primary key(user_id, group_code)
);
SELECT audit.audit_table('users_groups');

