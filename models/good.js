const db = require('./db');

module.exports = {
  async findGoodDetail(goodId) {
    // let goodDetail = await db.q('select * from good where goodId=?', [goodId]);
    let goodDetail = await db.q('select good.name,good.price,good.type,good_image.image,good_image.type from good, good_image where good.goodId=good_image.goodId and good.goodId=?', [goodId]);
    const goodImgs = goodDetail.map(({ image }) => image);
    return {name: goodDetail[0].name, price: goodDetail[0].price, goodImgs,};
  }
}