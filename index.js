//library import

const Koa = require('koa');
const mount = require('koa-mount');
const graphqlHTTP = require('koa-graphql');

//personal import
const mySchema = require("./schema/schema"); 

//library init
const app = new Koa();

//setting env
const port = process.env.PORT || 3000

app.use(mount('/graphql', graphqlHTTP({
  schema: mySchema,
  graphiql: true
})));
 
app.listen(port,()=>{
  console.clear();
  console.log("The magic start below at port : " + port);
});