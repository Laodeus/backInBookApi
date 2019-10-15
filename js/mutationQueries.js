const { DateTime } = require("luxon");

let Databaseurl =
  process.env.DATABASE_URL ||
  "postgres://postgres:root@127.0.0.10:5432/postgres";

const Pool = require("pg").Pool;
const pool = new Pool({
  connectionString: Databaseurl
});

const queries = require("./queries");

const insertIntoBooks = async args => {
  const last_entries = await queries.booksLast();

  let author = await queries.author(args.author_id);
  if (!author) {
    throw new Error("Unknow author");
  }
  const result = await pool.query(
    `INSERT INTO books (
        id, 
        title,
        subtitle,
        blanket,
        lang,
        format_books,
        borrow_id,
        borrow_date,
        genre,
        "ISBN",
        author_id
        ) 
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
    [
      last_entries.id + 1,
      args.title,
      args.subtitle || "",
      args.blanket || "",
      args.lang || "",
      args.format_book || "",
      "", // borrow id
      "", // borrow date
      args.genre || "",
      args.ISBN,
      args.author_id
    ]
  );

  return result;
};

const updateIntoBooks = async args => {
  const last_entries = await queries.booksLast();

  let book = await queries.book(args.id);
  if (!book) {
    throw new Error("Unknow book id");
  }

  const result = await pool.query(
    `UPDATE books SET
        title = $1,
        subtitle= $2,
        blanket= $3,
        lang= $4,
        format_books= $5,
        genre= $6,
        "ISBN"= $7,
        author_id= $8
         where id = $9`,
    [
      args.title,
      args.subtitle || "",
      args.blanket || "",
      args.lang || "",
      args.format_book || "",
      args.genre || "",
      args.ISBN,
      args.author_id,
      args.id
    ]
  );

  return result;
};

const deleteIntoBooks = async args => {
  let book = await queries.book(args.id);
  if (!book) {
    throw new Error("Unknow book id");
  }

  const result = await pool.query(
    `DELETE FROM books
    WHERE id = $1`,
    [args.id]
  );

  return result;
};

const borrowABook = async args => {
  if (!args.bookId) {
    throw new Error("bookId need to be set.");
  } // not set throw error
  if (!args.userId) {
    throw new Error("userId need to be set.");
  }

  let book = await queries.book(args.bookId);
  if (!book) {
    throw new Error("Unknow book id");
  }
  console.log(book);
  if (book.borrow_id) {
    throw new Error("Already borrowed");
  }
  let user = await queries.usersById(args.userId);
  if (!user) {
    throw new Error("Unknow user id");
  }

  const alreadyBorrowed = await queries.booksByBorrowerId(args.userId);
  if (alreadyBorrowed.length >= 5) {
    throw new Error("You already own 5 books");
  }

  const allOutdated = alreadyBorrowed.filter(element => {
    const ElementBorrowDate = DateTime.fromISO(element.borrow_date);
    return ElementBorrowDate.diffNow(["days", "hours"]).toObject().days <= -30;
  });

  if (allOutdated.length > 0) {
    throw new Error("somes books are late");
  }
  const result = await pool.query(
    `UPDATE books SET
              borrow_id = $1,
              borrow_date= $2
              where id = $3`,
    [args.userId, DateTime.fromObject(Date.now()).toISODate(), args.bookId]
  );
  const allAlreadyBorrowed = await queries.booksByBorrowerId(args.userId);
  return allAlreadyBorrowed;
};

const returnABook = async args => {
  if (!args.bookId) {
    throw new Error("bookId not provided");
  }
  if (!args.userId) {
    throw new Error("userId not provided");
  }
  let book = await queries.book(args.bookId);
  if (!book) {
    throw new Error("Unknow book id");
  }
  let user = await queries.usersById(args.userId);
  if (!user) {
    throw new Error("Unknow user id");
  }

  if (book.borrow_id != args.userId) {
    throw new Error("book not borrowed by this user");
  }

  const result = await pool.query(
    `UPDATE books SET
              borrow_id = '',
              borrow_date= ''
              where id = $1`,
    [args.bookId]
  );
  const allAlreadyBorrowed = await queries.booksByBorrowerId(args.userId);
  return allAlreadyBorrowed;
};

const addAuthor = async args => {
  const last_entries = await queries.authorLast();
  if (!args.name) {
    throw new Error("name must be provided");
  }

  const result = await pool.query(
    `INSERT INTO authors (
          id, 
          name
          ) 
      VALUES ($1,$2)`,
    [last_entries.id + 1, args.name]
  );

  return result;
};

const signUp = async args => {
    const last_entries = await queries.userLast();
  if (!args.email) {
    throw new Error("email must be provided.");
  }
  if (!args.password) {
    throw new Error("password must be provided.");
  }
  const foundUser = await queries.usersByEmail(args.email);
  if(foundUser){
      throw new Error("Email already signed up");
  }

  const result = await pool.query(
    `INSERT INTO users (
          id,
          role,
          name,
          email,
          password
          ) 
      VALUES ($1,$2,$3,$4,$5)`,
    [last_entries.id + 1,"user", args.name||"",args.email,args.password]
  );
  return result;
};

module.exports = {
  insertIntoBooks,
  updateIntoBooks,
  deleteIntoBooks,
  borrowABook,
  returnABook,
  addAuthor,
  signUp
};
