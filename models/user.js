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
  }
}