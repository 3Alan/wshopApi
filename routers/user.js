const Router = require('koa-router');
const userController = require('../controllers/user');

let userRouter = new Router();

userRouter.post('/user/wechatLogin', userController.wechatLogin);
userRouter.post('/user/login', userController.login);
userRouter.post('/user/add_address', userController.addAddress);
userRouter.post('/user/delivery', userController.delivery);
userRouter.post('/user/cancel_order', userController.cancelOrder);
userRouter.post('/user/confirm_receiving', userController.confirmReceiving);
userRouter.post('/user/order_evaluate', userController.orderEvaluate);
userRouter.post('/user/collect_good', userController.collectGood);
userRouter.post('/user/submit_order', userController.submitOrder);
userRouter.post('/user/pay_for_order', userController.payForOrder);
userRouter.post('/user/get_order_list', userController.getOrderList);
userRouter.post('/user/cancel_collect', userController.cancelCollect);
userRouter.post('/user/save_history_search', userController.saveHistorySearch);
userRouter.post('/user/delete_history', userController.deleteHistory);

userRouter.get('/user/get_address_list', userController.getAddressList);
userRouter.get('/user/delete_address', userController.deleteAddress);
userRouter.get('/user/find_address', userController.findAddress);
userRouter.get('/user/set_default_address', userController.setDefaultAddress);
userRouter.get('/user/check_user_account', userController.checkUserAccount);
userRouter.get('/user/get_order_detail', userController.getOrderDetail);
userRouter.get('/user/get_collection_list', userController.getCollectionList);

userRouter.get('/user/get_history', userController.getHistory);

module.exports = userRouter;