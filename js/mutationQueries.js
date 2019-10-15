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
    console.log(last_entries)
//   const result = await pool.query(
//     `INSERT INTO table (
//         nom_colonne_1, 
//         nom_colonne_2, ) 
//     VALUES (
//         'valeur 1', 
//         'valeur 2'
//         )`,
//     [
//         email, 
//         password
//     ]);
};

module.exports = {
    insertIntoBooks
};
