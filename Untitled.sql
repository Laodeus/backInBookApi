CREATE TABLE "books" (
  "id" int,
  "author_id" int,
  "comment_id" int,
  "title" text,
  "subtitle" text,
  "blanket" varchar,
  "lang" varchar,
  "format_books" text,
  "stock" numeric(0,10) DEFAULT 1,
  "genre" text
);

CREATE TABLE "authors" (
  "id" int,
  "name" varchar,
  "surname" varchar
);

CREATE TABLE "comment" (
  "id" int,
  "user_id" int,
  "title" text,
  "com" varchar,
  "eval" numeric
);

CREATE TABLE "users" (
  "id" int,
  "privilege" varchar,
  "blacklist" varchar,
  "name" text,
  "surname" text,
  "email" text,
  "password" text
);