let Koa = require("koa");
let app = new Koa();

app.use(async (ctx, next) =>{ 
        ctx.body = "Hello koa world";
        await next();
        console.log("after await")
    }
)
.use((ctx, next)=>{
        console.log("in the next");
        next();
    }
)
.use((ctx, next)=>{
        console.log("another next")
    }
)
.use((ctx, next)=>{
    console.log("No next")
    }
)
.listen(3000,()=>{
    console.clear();
    console.log(`Client Initialisation`);
})