const goodModel = require('../models/good');

module.exports = {
  async getGoodDetail (ctx, next) {
    const { goodId } = ctx.query;
    
    // let { goodId } = ctx.request.body;
    let goodDetail = await goodModel.findGoodDetail(goodId);
    ctx.body = { goodDetail };
  }
}