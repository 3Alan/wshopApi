const request = require('request');
const userModel = require('../models/user');
const jwt = require('jsonwebtoken');

const appid = "wxe2f51632adeb6a99";
const secret = "7e2c71a51284ef29da506282d7311996";

module.exports = {
  wechatLogin: async (ctx, next) => {
    
    console.log(ctx);
    const { code } = ctx.request.body;
    
    const result = await new Promise((resolve, reject) => {
      request(
        `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`,
        (err, res, body) => {
          if (err) {
            reject(err);
          } else {
            resolve(body);
          }
        }
      );
    });
    ctx.body = {
      openid: JSON.parse(result).openid
    };
  },

  async login(ctx, next) {
    const { username, password } = ctx.request.body;
    const userExit = await userModel.findUser(username);
    
    if (!userExit) {
      // 注册
      await userModel.register(username, password);
    }
    const userValidate = await userModel.checkUser(username, password);
    console.log(userValidate);
    
    //验证用户名以及密码
    if (userValidate) {
      const token = jwt.sign({username, password}, secret, {expiresIn: '12h'});
      ctx.body = {
        msg: '登录成功！',
        code: '00001',
        token,
      }
    } else {
      ctx.body = {
        msg: '登录失败，请检查用户名及密码是否正确！',
        code: '00002',
        token: null,
      }
    }

    // 返回token
    
  }
};
