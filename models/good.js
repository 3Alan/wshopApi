const db = require('./db');

module.exports = {
  async findGoodDetail(goodId) {
    const baseInfo = await db.q('select * from good g where g.goodId=?', [goodId]);
    let goodImgList = await db.q('select i.image from good g inner join good_image i on g.goodId=i.goodId and g.goodId=?', [goodId]);
    let goodSizeList = await db.q('select s.size from good g INNER JOIN good_size s on g.goodId=s.goodId and g.goodId=?', [goodId]);
    const goodCommentNum = await db.q('select * from orders o INNER JOIN good g on o.goodId=g.goodId and o.goodId=? and o.comment_type=1', [goodId]);
    const allCommentNum = await db.q('select * from orders o INNER JOIN good g on o.goodId=g.goodId and o.goodId=? and o.comment_type in (0,1)', [goodId]);
    const goodRate = (goodCommentNum.length / allCommentNum.length).toFixed(1) * 100;
    goodImgList = goodImgList.map(({ image }) => image);
    goodSizeList = goodSizeList.map(({ size }) => size);

    return {...baseInfo[0], goodImgList, goodSizeList, goodRate, commentNum: allCommentNum.length };
  },

  async findGoodList(type) {
    let goodList = await db.q('select * from good where type=?', [type]);
    return goodList;
  },

  async getHotSearch() {
    return await db.q('select * from hot_search where num>5');
  },

  async findGood(value) {
    return await db.q('select * from good where name like ?', [`%${value}%`]);
  },

  async findHotHistory(searchValue) {
    return await db.q('select * from hot_search where content=?', [searchValue]);
  },

  async addHotHistory(searchValue) {
    return await db.q('insert into hot_search(content,num) values(?,1)', [searchValue]);
  },

  async updateHotHistory(searchValue) {
    return await db.q('update hot_search set num=num+1 where content=?', [searchValue]);
  },

  async getGoodComment(goodId) {
    return await db.q('select username,time,comment,comment_type from orders where goodId=? and status=5', [goodId]);
  },

  async findGoodDetailByUser(username, goodId) {
    const baseInfo = await db.q('select * from good g where g.goodId=?', [goodId]);
    let goodImgList = await db.q('select i.image from good g inner join good_image i on g.goodId=i.goodId and g.goodId=?', [goodId]);
    let goodSizeList = await db.q('select s.size from good g INNER JOIN good_size s on g.goodId=s.goodId and g.goodId=?', [goodId]);
    const isCollected =  await db.q('select status from collection where username=? and goodId=?',[username,goodId]);
    const goodCommentNum = await db.q('select * from orders o INNER JOIN good g on o.goodId=g.goodId and o.goodId=? and o.comment_type=1', [goodId]);
    const allCommentNum = await db.q('select * from orders o INNER JOIN good g on o.goodId=g.goodId and o.goodId=? and o.comment_type in (0,1)', [goodId]);
    const goodRate = (goodCommentNum.length / allCommentNum.length).toFixed(3) * 100;
    goodImgList = goodImgList.map(({ image }) => image);
    goodSizeList = goodSizeList.map(({ size }) => size);

    return {...baseInfo[0], goodImgList, goodSizeList, ...isCollected[0], goodRate, commentNum: allCommentNum.length};
  }
}