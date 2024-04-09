create table users (
  id bigserial primary key,
  username text not null unique,
  password text,
  createdat timestamp default(now())
);
------
DROP TABLE users;
