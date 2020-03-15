const Router = require('koa-router');
const goodController = require('../controllers/good');

let goodRouter = new Router();

goodRouter.get('/good/goodDetail', goodController.getGoodDetail);
goodRouter.get('/good/goodList', goodController.getGoodList);

module.exports = goodRouter;