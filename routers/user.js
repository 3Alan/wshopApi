const Router = require('koa-router');
const userController = require('../controllers/user');

let userRouter = new Router();

userRouter.post('/user/wechatLogin', userController.wechatLogin);
userRouter.post('/user/login', userController.login);

module.exports = userRouter;