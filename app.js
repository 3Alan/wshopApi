const Koa = require('koa');
const goodRouter = require('./routers/good');
const userRouter = require('./routers/user');
const testRouter = require('./routers/test');
const { appPort } = require('./config');
const bodyParser = require('koa-bodyparser');
const error = require('./middleware/error');
const koaJwt = require('koa-jwt');
const verify = require('./middleware/verify');
const { secret } = require('./config')

let app = new Koa();

app.listen(appPort, ()=> {
  console.log(`服务器在${appPort}端口启动`);
});

app.use(error);

// secret 为不能向外透露的密钥，并且设置一下路径不需要使用jwt验证
app.use(koaJwt({ secret }).unless({
  path: [
    /\/user\/login/,
    /\/user\/wechatLogin/,
    /\/user\/register/,
    /\/user\/check_user_name/,
    /^((?!\/user).)*$/,
    /\/user\/.*_history/,
  ]
}));

app.use(verify);

app.use(bodyParser());

app.use(goodRouter.routes());
app.use(userRouter.routes());
app.use(testRouter.routes());
app.use(goodRouter.allowedMethods());
app.use(userRouter.allowedMethods());
app.use(testRouter.allowedMethods());