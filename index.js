let Koa = require("koa");
let app = new Koa();

app.use(async (ctx, next) =>{
        ctx.body = "Hello koa world";
    }
)

.listen(3000,()=>{
    console.clear();
    console.log(`Client Initialisation`);
})