CREATE TABLE books (
  id serial,
  name text not null,
  isbn text not null,
  datePublished date not null,
  primary key id
);