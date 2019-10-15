let Databaseurl =
  process.env.DATABASE_URL ||
  "postgres://postgres:root@127.0.0.10:5432/postgres";

const Pool = require("pg").Pool;
const pool = new Pool({
  connectionString: Databaseurl
});

const login = async (email, password) => {
  if (!email) {
    throw new Error("email needed");
  }
  if (!password) {
    throw new Error("password needed");
  }
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1 AND password = $2",
    [email, password]
  );
  if (result.rows.length <= 0) {
    throw new Error("Login Failed");
  }
  return result.rows;
};

const book = async id => {
  if (!id) {
    throw new Error("id needed");
  }
  const result = await pool.query("SELECT * FROM books WHERE id = $1", [id]);
  return result.rows[0]; // rows return an array of all rows found. if there is only one, it return an array of 1 object
};

const books = async (limit, offset) => {
  const result = await pool.query("SELECT * FROM books LIMIT $1 OFFSET $2", [
    limit,
    offset
  ]);
  console.log(result);
  return result.rows; // rows return an array of all rows found. if there is only one, it return an array of 1 object
};

const booksById = async id => {
  if (!id) {
    throw new Error("id needed");
  }
  const result = await pool.query("SELECT * FROM books WHERE id = $1", [id]);
  return result.rows; // rows return an array of all rows found. if there is only one, it return an array of 1 object
};

const booksCount = async id => {
  const result = await pool.query("SELECT COUNT(*) FROM books");
  return result.rows; // rows return an array of all rows found. if there is only one, it return an array of 1 object
};

const booksLast = async id => {
  const result = await pool.query("SELECT * FROM books ORDER BY id DESC LIMIT 1");
  return result.rows[0]; // rows return an array of all rows found. if there is only one, it return an array of 1 object
};


const booksByBorrowerId = async id => {
  if (!id) {
    throw new Error("id needed");
  }
  const result = await pool.query("SELECT * FROM books WHERE borrow_id = $1", [
    id
  ]);
  return result.rows; // rows return an array of all rows found. if there is only one, it return an array of 1 object
};

const author = async id => {
  if (!id) {
    throw new Error("id needed");
  }
  const result = await pool.query("SELECT * FROM authors WHERE id = $1", [id]);
  return result.rows[0]; // rows return an array of all rows found. if there is only one, it return an array of 1 object
};

const authors = async (limit, offset) => {
  const result = await pool.query("SELECT * FROM authors LIMIT $1 OFFSET $2", [
    limit,
    offset
  ]);
  return result.rows; // rows return an array of all rows found. if there is only one, it return an array of 1 object
};

const authorLast = async id => {
  const result = await pool.query("SELECT * FROM authors ORDER BY id DESC LIMIT 1");
  return result.rows[0]; // rows return an array of all rows found. if there is only one, it return an array of 1 object
};

const user = async id => {
  if (!id) {
    throw new Error("id needed");
  }
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0]; // rows return an array of all rows found. if there is only one, it return an array of 1 object
};

const users = async (limit, offset) => {
  const result = await pool.query("SELECT * FROM users LIMIT $1 OFFSET $2", [
    limit,
    offset
  ]);
  console.log(result.rows);
  return result.rows; // rows return an array of all rows found. if there is only one, it return an array of 1 object
};

const usersById = async id => {
  if (!id) {
    throw new Error("id needed");
  }
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0]; // rows return an array of all rows found. if there is only one, it return an array of 1 object
};

const comment = async id => {
  if (!id) {
    throw new Error("id needed");
  }
  const result = await pool.query("SELECT * FROM comment WHERE id = $1", [id]);
  return result.rows[0]; // rows return an array of all rows found. if there is only one, it return an array of 1 object
};

const comments = async (limit, offset) => {
  const result = await pool.query("SELECT * FROM comment LIMIT $1 OFFSET $2", [
    limit,
    offset
  ]);
  console.log(result.rows);
  return result.rows; // rows return an array of all rows found. if there is only one, it return an array of 1 object
};

const commentsByBookId = async id => {
  if (!id) {
    throw new Error("id needed");
  }
  const result = await pool.query("SELECT * FROM comment WHERE book_id = $1", [
    id
  ]);
  return result.rows; // rows return an array of all rows found. if there is only one, it return an array of 1 object
};

const commentsByUserId = async id => {
  if (!id) {
    throw new Error("id needed");
  }
  const result = await pool.query("SELECT * FROM comment WHERE user_id = $1", [
    id
  ]);
  return result.rows; // rows return an array of all rows found. if there is only one, it return an array of 1 object
};

module.exports = {
  login,
  book,
  books,
  booksById,
  booksCount,
  booksLast,
  booksByBorrowerId,
  author,
  authors,
  authorLast,
  user,
  users,
  usersById,
  comment,
  comments,
  commentsByBookId,
  commentsByUserId
};
