const Router = require('koa-router');
const goodController = require('../controllers/good');

let goodRouter = new Router();

goodRouter.get('/good/goodDetail', goodController.getGoodDetail);
goodRouter.get('/good/goodList', goodController.getGoodList);
goodRouter.get('/good/search', goodController.search);
goodRouter.get('/good/get_good_comment', goodController.getGoodComment);

module.exports = goodRouter;