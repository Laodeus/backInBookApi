let Koa = require("koa");
let app = new Koa();

app.use(async (ctx, next) =>{ 
        ctx.body = "Hello koa world"; // this is how we send a reponse
        await next(); // everyting that's under this in this bloc will be processed after the next .use
        console.log("after await")
    }
)
.use((ctx, next)=>{
        console.log("another next");
        console.log(ctx)
        ctx.assert(false, 406); // 406 mean inacceptable. so assert take a bool in params and the code of response if this params is false.
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