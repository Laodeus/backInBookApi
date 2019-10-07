const Koa = require('koa');
const mount = require('koa-mount');
const graphqlHTTP = require('koa-graphql');
const mySchema = require("./schema/schema"); 
const app = new Koa();
 
app.use(mount('/graphql', graphqlHTTP({
  schema: mySchema,
  //graphiql: true
})));
 
app.listen(3615);