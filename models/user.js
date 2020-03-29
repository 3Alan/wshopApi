const db = require('./db');

module.exports = {
  async findUser(username) {
    const userExist = await db.q('select * from user where username=?', [username]);
    return userExist.length === 0 ? false : true;
  },
  async register(username, password) {
     return await db.q('insert into user(username, password, balance) values(?,?,0)', [username, password]);
  },
  async checkUser(username, password) {
     const userValidate = await db.q('select * from user where username=? and password=?', [username, password]);
     return userValidate.length === 0 ? false : true;
  },
  async recharge(username, price) {
     await db.q('update user set balance=balance+? where username=?', [price, username]);
  },
  async addAddress(username, address) {
     await db.q('update address set is_default=0 where username=?', [username]);
     const addRes = await db.q('insert into address(username, receiver, tel, address, is_default) values(?,?,?)', [username, Object.values(address), 1]);
     return addRes.length === 0 ? false : true;
  },
  async getAddressList(username) {
     const Res = await db.q('select * from address where username=?', [username]);
     return Res;
  },
  async deleteAddress(id) {
     const Res = await db.q('delete from address where id=?', [id]);
     return Res;
  },
  async findAddress(id) {
     const Res = await db.q('select * from address where id=?', [id]);
     return Res;
  },
  async setDefaultAddress(id) {
     await db.q('update address set is_default=0');
     await db.q('update address set is_default=1 where id=?', [id]);
  },
  async submitOrder(username, orderId, addressId, goodId, size, submitTime) {
     await db.q('insert into orders(username, orderId, goodId, addressId, status, size, time) values(?,?,?,?,?,?,?)',[username, orderId, goodId, addressId, 1, size, submitTime]);
  },
  async getOrderDetail(orderId) {
     return await db.q('select * from orders o inner join good g inner join address a on o.goodId=g.goodId and o.addressId=a.id and o.orderId=?',[orderId]);
  },
  async checkUserAccount(username) {
     return await db.q('select balance from user where username=?',[username]);
  },
  async payForOrder(username, orderId, orderPrice) {
     await db.q('update user set balance=balance-? where username=?',[orderPrice, username]);
     await db.q('update orders set status=2 where orderId=?',[orderId]);
  },
  async delivery(orderId) {
     await db.q('update orders set status=3 where orderId=?',[orderId]);
  },
  async cancelOrder(orderId) {
     await db.q('update orders set status=6 where orderId=?',[orderId]);
  },
  async confirmReceiving(orderId) {
     await db.q('update orders set status=4 where orderId=?',[orderId]);
  },
  async getOrderList(username, status) {
     if (status === 5 ) {
      return await db.q('select orderId, name, size, price, main_img from orders o inner join good g on o.goodId=g.goodId and username=? and status in (5,6)',[username]);
     }
     return await db.q('select orderId, name, size, price, main_img from orders o inner join good g on o.goodId=g.goodId and username=? and status=?',[username, status]);
     
  },
  async getOrderAddress(orderId) {
     return await db.q('select receiver, tel, address from address a inner join orders o on o.addressId=a.id and o.orderId=?',[orderId]);
  },
  async getOrderGood(orderId) {
     return await db.q('select main_img, name, price from good g inner join orders o on o.goodId=g.goodId and o.orderId=?',[orderId]);
  },
  async orderEvaluate(orderId, comment, commentType) {
     await db.q('update orders set status=5, comment=?, comment_type=? where orderId=?',[comment,commentType,orderId]);
  },
  async findUserCollection(username, goodId) {
     return await db.q('select * from collection where username=? and goodId=?',[username,goodId]);
  },
  async addCollect(username, goodId) {
     return await db.q('insert into collection(username,goodId,status) value(?,?,?)',[username,goodId, 1]);
  },
  async toggleCollect(username, goodId) {
     return await db.q('update collection set status=-status where username=? and goodId=?',[username,goodId]);
  },
  async getCollectionList(username) {
     return await db.q('select g.name,g.price,g.main_img,c.id,c.goodId from good g,collection c where g.goodId=c.goodId and c.status=1 and c.username=?',[username]);
  },
  async cancelCollect(id) {
     await db.q('update collection set status=-1 where id=?',[id]);
  },
  async getHistory(username) {
     return await db.q('select * from history_search where username=?',[username]);
  },
  async findHistory(username,searchValue) {
     return await db.q('select * from history_search where username=? and content=?',[username,searchValue]);
  },
  async saveHistorySearch(username,searchValue) {
     return await db.q('insert into history_search(username,content) values(?,?)',[username,searchValue]);
  },
  async deleteHistory(username) {
     return await db.q('delete from history_search where username=?',[username]);
  }
}