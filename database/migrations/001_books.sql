CREATE TABLE books (
  id serial primary key,
  name text not null,
  isbn text,
  datePublished date not null
);
------
DROP TABLE books;