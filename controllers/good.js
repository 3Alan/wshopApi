const goodModel = require('../models/good');

module.exports = {
  async getGoodDetail (ctx, next) {
    const { goodId } = ctx.query;
    let goodDetail = await goodModel.findGoodDetail(goodId);
    ctx.body = { goodDetail };
  },

  async getGoodList (ctx, next) {
    const { type } = ctx.query;
    let goodList = await goodModel.findGoodList(type);
    ctx.body = { goodList };
  }
}