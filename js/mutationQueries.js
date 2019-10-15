let Databaseurl =
  process.env.DATABASE_URL ||
  "postgres://postgres:root@127.0.0.10:5432/postgres";

const Pool = require("pg").Pool;
const pool = new Pool({
  connectionString: Databaseurl
});

const queries = require("./queries");



const insertIntoBooks = async (args) => {
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
        last_entries.id+1,
        args.title,
        args.subtitle||"",
        args.blanket||"",
        args.lang||"",
        args.format_book||"",
        "", // borrow id
        "", // borrow date
        args.genre||"",
        args.ISBN,
        args.author_id
    ]);

    return result;
};

const updateIntoBooks = async (args) => {
    const last_entries = await queries.booksLast();
    
    let book = await queries.book(args.author_id);
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
        args.subtitle||"",
        args.blanket||"",
        args.lang||"",
        args.format_book||"",
        args.genre||"",
        args.ISBN,
        args.author_id,
        args.id
    ]);

    return result;
};

module.exports = {
    insertIntoBooks,
    updateIntoBooks
};
