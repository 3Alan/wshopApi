const Router = require('koa-router');

let testRouter = new Router();

testRouter.get('/test/getTodoList', (ctx) => {
  ctx.body = {
    datas: [
      'todo1 from api mock',
      'todo2 from api mock',
      'todo3 from api mock'
    ]
  }
});

module.exports = testRouter;