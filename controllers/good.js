const goodModel = require('../models/good');

module.exports = {
  async getGoodDetail (ctx, next) {
    const { goodId } = ctx.query;
    const { username } = ctx.state.user || '';
    let goodDetail;
    if (username) {
      goodDetail = await goodModel.findGoodDetailByUser(username, goodId);
    } else {
      goodDetail = await goodModel.findGoodDetail(goodId);
    }
    
    ctx.body = { goodDetail };
  },

  async getGoodList (ctx, next) {
    const { type } = ctx.query;
    let goodList = await goodModel.findGoodList(type);
    ctx.body = { goodList };
  },

  async search (ctx, next) {
    const { value } = ctx.query;
    const goodList = await goodModel.findGood(value);
    ctx.body = { goodList };
  },

  async getGoodComment (ctx, next) {
    const { goodId } = ctx.query;
    const goodCommentList = await goodModel.getGoodComment(goodId);
    ctx.body = { goodCommentList };
  }
}