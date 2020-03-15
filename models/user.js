const db = require('./db');

module.exports = {
  async findUser(username) {
    const userExist = await db.q('select * from user where username=?', [username]);
    return userExist.length === 0 ? false : true;
  },
  async register(username, password) {
     return await db.q('insert into user(username, password) values(?,?)', [username, password]);
  },
  async checkUser(username, password) {
     const userValidate = await db.q('select * from user where username=? and password=?', [username, password]);
     return userValidate.length === 0 ? false : true;
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
  }
}