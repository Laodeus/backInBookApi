CREATE TABLE "books" (
  "id" int,
  "author_id" int,
  "comment_id" int,
  "title" int,
  "subtitle" int,
  "blanket" varchar,
  "lang" int,
  "format_books" int,
  "stock" numeric(0,10) DEFAULT 1,
  "genre" int
);

CREATE TABLE "authors" (
  "id" int,
  "name" varchar,
  "surname" varchar
);

CREATE TABLE "comment" (
  "id" int,
  "user_id" int,
  "title" int,
  "com" varchar,
  "eval" numeric
);

CREATE TABLE "users" (
  "id" int,
  "privilege" int,
  "blacklist" int,
  "borrowing" int DEFAULT 1,
  "name" int,
  "surname" int,
  "email" int,
  "password" text
);