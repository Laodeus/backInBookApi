CREATE TABLE "books" (
  "id" int,
  "author_id" int,
  "comment_id" int,
  "stock_id" int,
  "title" int,
  "subtitle" int,
  "blanket" varchar,
  "lang" int
);

CREATE TABLE "authors" (
  "id" int,
  "name" varchar,
  "surname" varchar
);

CREATE TABLE "stocks" (
  "id" int,
  "size" int,
  "stock" numeric(0,10) DEFAULT 1
);

CREATE TABLE "comment" (
  "id" int,
  "user_id" int,
  "title" int,
  "com" varchar,
  "counterN" int,
  "counterP" int
);

CREATE TABLE "users" (
  "id" int,
  "privilege" int,
  "blacklist" int,
  "borrowing" int DEFAULT 1,
  "name" int,
  "surname" int,
  "email" int,
  "password" text,
  "birthday" date
);

ALTER TABLE "authors" ADD FOREIGN KEY ("id") REFERENCES "books" ("author_id");

ALTER TABLE "comment" ADD FOREIGN KEY ("id") REFERENCES "books" ("comment_id");

ALTER TABLE "books" ADD FOREIGN KEY ("stock_id") REFERENCES "stocks" ("id");

ALTER TABLE "users" ADD FOREIGN KEY ("id") REFERENCES "comment" ("user_id");
