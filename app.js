const Koa = require('koa');
const goodRouter = require('./routers/good');
const userRouter = require('./routers/user');
const { appPort } = require('./config');
const bodyParser = require('koa-bodyparser');
const error = require('./middleware/error');
const koaJwt = require('koa-jwt');
const verify = require('./middleware/verify');

const secret = '7e2c71a51284ef29da506282d7311996';

let app = new Koa();

app.listen(appPort, ()=> {
  console.log(`服务器在${appPort}端口启动`);
});

app.use(error);

app.use(koaJwt({secret}).unless({
  path: [
    /\/user\/login/,
    /^((?!\/user).)*$/,
  ]
}));

app.use(verify);

app.use(bodyParser());

app.use(goodRouter.routes());
app.use(userRouter.routes());
app.use(goodRouter.allowedMethods());
app.use(userRouter.allowedMethods());