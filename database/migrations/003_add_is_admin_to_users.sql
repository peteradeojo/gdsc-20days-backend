alter table users add is_admin smallint default(0);
------
alter table users drop column is_admin;