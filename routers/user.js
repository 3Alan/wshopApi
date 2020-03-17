const Router = require('koa-router');
const userController = require('../controllers/user');

let userRouter = new Router();

userRouter.post('/user/wechatLogin', userController.wechatLogin);
userRouter.post('/user/login', userController.login);
userRouter.post('/user/add_address', userController.addAddress);
userRouter.get('/user/get_address_list', userController.getAddressList);
userRouter.get('/user/delete_address', userController.deleteAddress);
userRouter.get('/user/find_address', userController.findAddress);
userRouter.get('/user/set_default_address', userController.setDefaultAddress);
userRouter.post('/user/submit_order', userController.submitOrder);
userRouter.get('/user/check_user_account', userController.checkUserAccount);
userRouter.post('/user/pay_for_order', userController.payForOrder);
userRouter.post('/user/get_order_list', userController.getOrderList);
userRouter.get('/user/get_order_detail', userController.getOrderDetail);
userRouter.post('/user/delivery', userController.delivery);
userRouter.post('/user/confirm_receiving', userController.confirmReceiving);
userRouter.post('/user/order_evaluate', userController.orderEvaluate);

module.exports = userRouter;