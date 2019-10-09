CREATE TABLE "books" (
  "id" int,
  "author_id" int,
  "title" text,
  "subtitle" text,
  "blanket" varchar,
  "lang" varchar,
  "format_books" text,
  "stock" numeric DEFAULT 1,
  "genre" text,
  "ISBN" int
);

CREATE TABLE "authors" (
  "id" int,
  "name" varchar
);

CREATE TABLE "comment" (
  "id" int,
  "book_id" int ,
  "user_id" int,
  "title" text,
  "com" varchar,
  "eval" numeric
);

CREATE TABLE "users" (
  "id" int,
  "role" varchar,
  "name" text,
  "surname" text,
  "email" text,
  "password" text
);