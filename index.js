let fs = require("fs");
let Koa = require("koa");
let app = new Koa();

app
  .use(async (ctx, next) => {
    ctx.assert(ctx.accepts("xml"), 406); // 406 mean inacceptable. so assert take a bool in params and the code of response if this params is false.
    // if assert throw the error, the server stop and trhow the error to the client.
    // then, the next is not executed. and it's finished
    await next(); // everyting that's under this in this bloc will be processed after the next .use
    // await will be the garrant that the code below will not be executed before the next use have finished his execution.
    console.log("after await");
  })
  .use((ctx, next) => {
    console.log("another next");
    ctx.response.type = "xml";
    ctx.body = "<ok>ok</ok>";
  })
  .use((ctx, next) => {
    console.log("No next");
  })
  .listen(3000, () => {
    console.clear();
    console.log(`Client Initialisation`);
  });
