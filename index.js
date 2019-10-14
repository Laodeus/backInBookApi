//library import

const Koa = require('koa');
const mount = require('koa-mount');
const graphqlHTTP = require('koa-graphql');
const knex = require('knex')
//personal import
const mySchema = require("./schema/schema"); 

//library init
const app = new Koa();

//setting env
const port = process.env.PORT || 3000;
let url = "postgres://postgres:root@127.0.0.10:5432/postgres";


app.use((ctx, next)=>{ // error handling
  next().catch((err)=>{
    if (!(err instanceof Error)) {
      const originalError = err
      let errMsg = 'non-error thrown: '
      try {
        errMsg += JSON.stringify(err);
      } catch (e) {
        errMsg += err
      }
      err = new Error(errMsg);
      err.originalError = originalError
      typeof originalError === 'object' && Object.assign(err, originalError)
    }
  })
});

app.use(
  knex({
    client: "pg",
    connection: {
      host: "127.0.0.1",
      user: "postgres",
      password: "root",
      database: "postgres",

    }
  })
);

console.log(knex)

app.use(mount('/graphql', graphqlHTTP({
  schema: mySchema,
  graphiql: true
})));

app.use(mount('/',(ctx)=>{
  ctx.type = 'html' 
  ctx.body = "It's not the api that you looking for... <br /><img src='http://3.bp.blogspot.com/-uq0glR1pPUw/VqEUKKBA-eI/AAAAAAAASCw/r2tQOAZBsgY/s1600/droids.gif' />"
}));

app.listen(port,()=>{
  console.clear();
  console.log("The magic start below at port : " + port);
});