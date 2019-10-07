const Koa = require('koa');
const app = new Koa();

// response
app.use(ctx => {
    ctx.body = 'comment vas-tu';
    console.log(ctx.body);
});

app.listen(3000);