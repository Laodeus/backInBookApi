//library import

const Koa = require('koa');
const mount = require('koa-mount');
const graphqlHTTP = require('koa-graphql');
const pg = require('pg');

//setting env
const port = process.env.PORT || 3000;

//personal import
const mySchema = require("./schema/schema"); 

//library init
const app = new Koa();

app.use(mount('/graphql', graphqlHTTP({ 
  schema: mySchema,
  graphiql : true
})));

app.use(mount('/',(ctx)=>{
  ctx.type = 'html' 
  ctx.body = "It's not the api that you looking for... <br /><img src='http://3.bp.blogspot.com/-uq0glR1pPUw/VqEUKKBA-eI/AAAAAAAASCw/r2tQOAZBsgY/s1600/droids.gif' />"
}));

app.listen(port,()=>{
  console.clear();
  console.log("The magic start below at port : " + port);
});