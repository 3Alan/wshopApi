const db = require('./db');

module.exports = {
  async findGoodDetail(goodId) {
    const baseInfo = await db.q('select * from good g where g.goodId=?', [goodId]);
    let goodImgList = await db.q('select i.image from good g inner join good_image i on g.goodId=i.goodId and g.goodId=?', [goodId]);
    let goodSizeList = await db.q('select s.size from good g INNER JOIN good_size s on g.goodId=s.goodId and g.goodId=?', [goodId]);
    goodImgList = goodImgList.map(({ image }) => image);
    goodSizeList = goodSizeList.map(({ size }) => size);

    return {...baseInfo[0], goodImgList, goodSizeList};
  },
  async findGoodList(type) {
    let goodList = await db.q('select * from good where type=?', [type]);
    return goodList;
  }
}