const Koa = require('koa');
const jwt = require('koa-jwt');
const bodyParser = require('koa-bodyparser');
const app = new Koa();
const jsonwebtoken = require('jsonwebtoken');
 
// Custom 401 handling if you don't want to expose koa-jwt errors to users
app.use(function(ctx, next){
  return next().catch((err) => { // ici, il next et si y a une erreur, il le catch et retourne un message dans le body de la requete
    if (401 == err.status) {
      ctx.status = 401;
      ctx.body = 'Protected resource, use Authorization header to get access\n';
    } else {
      throw err;
    }
  });
});
 
// Unprotected middleware
app.use(bodyParser()); //
app.use(function(ctx, next){ // si dans la route il match un public dans l'url via la regexp, il retourne unprotected
  if (ctx.url.match(/^\/auth/)) {
    console.clear();
    console.log(ctx.header.login)
    if(ctx.header.login === "MaBite"){
      console.log("sign")
      ctx.body = { // jwt authentication => magic!!!
        token: jsonwebtoken.sign(
          { role: 'admin' },
          'A very secret key'), //Should be the same secret key as the one used is ./jwt.js
        message: "Successfully logged in!"
      };
    }
  } else {
    return next();
  }
});
// Middleware below this line is only reached if JWT token is valid
//app.use(jwt({ secret: 'shared-secret', passthrough: true  })); // passtrough sert a quand meme processer les middleware precedent meme si l'utilisateur n'est pas logguer
app.use(jwt({ secret: 'A very secret key', })); 
 

// Protected middleware
app.use(function(ctx){
  if (ctx.url.match(/^\/api/)) {
    ctx.body = 'protected\n';
  }
});
 
app.listen(3000);