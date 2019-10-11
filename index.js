const Koa = require('koa');
const mount = require('koa-mount');
const graphqlHTTP = require('koa-graphql');
const mySchema = require("./schema/schema"); 
const app = new Koa();


//=====================================================database

//postgres://pknnpjymiwxjly:dc637ed3da16a5c08ee37bcce4e1872cde9a1bfee13c7aa4f5170e313703dcc5@ec2-54-247-171-30.eu-west-1.compute.amazonaws.com:5432/d4n9e2hgnevk1r | defauld adr

const Url = process.env.DATABASE_URL;

  let host = 'localhost' ;
  let user = '';
  let password = '';
  let database = 'dylanevelette';

if (Url !== undefined) {
  let host = 'ec2-54-247-171-30.eu-west-1.compute.amazonaws.com';
  let user = Url.substr(11, Url.indexOf(':'));
  let password = Url.substr(Url.indexOf(':'), Url.indexOf('@'));
  let database = 'd4n9e2hgnevk1r';
}
var knex = require('knex')({
  client: 'pg',
  connection: {
    host : host,
    user : user,
    password : password,
    database : database
  },
  migrations: {
    tableName: 'migrations'
  }
});
knex.select('title').from('books');

let titre = knex.select('title').from('books');
console.log(titre);




//====================================================database




app.use(mount('/graphql', graphqlHTTP({
  schema: mySchema,
  graphiql: true
})));
app.listen(3615,()=>{
  console.clear();
  console.log("The magic start Below!");
});