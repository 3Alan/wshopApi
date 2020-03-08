const Koa = require('koa');
const goodRouter = require('./routers/good');
const { appPort } = require('./config');

let app = new Koa();

app.listen(appPort, ()=> {
  console.log(`服务器在${appPort}端口启动`);
});

app.use(goodRouter.routes());
app.use(goodRouter.allowedMethods());