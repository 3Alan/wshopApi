const request = require("request");
const userModel = require("../models/user");
const jwt = require("jsonwebtoken");
const moment = require('moment');

const appid = "wxe2f51632adeb6a99";
const secret = "7e2c71a51284ef29da506282d7311996";

const createUUID = (username) => {
  const user = username.split('');
  const uuid = [];
  for (let i = 0; i < 5; i++){
      uuid[i] = user[i] ? user[i].charCodeAt() : parseInt(Math.random()*90+10,10);;
  }
  return uuid.join('');
}

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

    //验证用户名以及密码
    if (userValidate) {
      const token = jwt.sign({ username, password }, secret, {
        expiresIn: "12h"
      });
      ctx.body = {
        msg: "登录成功！",
        code: "00001",
        token
      };
    } else {
      ctx.body = {
        msg: "登录失败，请检查用户名及密码是否正确！",
        code: "00002",
        token: null
      };
    }
    // 返回token
  },

  async addAddress(ctx, next) {
    const addressInfo = ctx.request.body;
    const { username } = ctx.state.user;
    const Res = await userModel.addAddress(username, addressInfo);
    const msg = Res ? '添加地址成功' : '添加失败请重试';
    const code = Res ? '1' : '0'
    ctx.body = {
      msg,
      code,
    }
  },

  async getAddressList(ctx, next) {
    const { username } = ctx.state.user;
    const addressList = await userModel.getAddressList(username);
    ctx.body = { addressList };
  },

  async deleteAddress(ctx, next) {
    const { id } = ctx.request.query;
    await userModel.deleteAddress(id);
    const { username } = ctx.state.user;
    const addressList = await userModel.getAddressList(username);
    ctx.body = { addressList };
  },

  async findAddress(ctx, next) {
    const { id } = ctx.request.query;
    const addressDeatil = await userModel.findAddress(id);
    ctx.body = { addressDeatil };
  },

  async setDefaultAddress(ctx, next) {
    const { id } = ctx.request.query;
    await userModel.setDefaultAddress(id);
    ctx.body = { 
      res: 1,
    };
  },

  async submitOrder(ctx, next) {
    const { username } = ctx.state.user;
    const { addressDetail, goodDetail, size } = ctx.request.body;
    const addressId = addressDetail.id;
    const goodId = goodDetail.goodId;
    const submitTime = moment().format('YYYY-MM-DD hh:mm');
    const orderId = `${new Date().getTime()}${goodId}${createUUID(username)}`
    await userModel.submitOrder(username, orderId, addressId, goodId, size, submitTime);
    const orderDetail = await userModel.getOrderDetail(orderId);
    ctx.body = {
      orderDetail,
      res: 'success',
      msg: '提交订单成功',
      status: 1,
    };
  },

  async checkUserAccount(ctx, next) {
    const { username } = ctx.state.user;
    const balance = await userModel.checkUserAccount(username);
    console.log(balance);
    
    ctx.body = balance[0];
  },

  async payForOrder(ctx, next) {
    const { username } = ctx.state.user;
    const { orderId, orderPrice } = ctx.request.body;
    await userModel.payForOrder(username, orderId, orderPrice);
    ctx.body = {
      msg: '支付成功！',
      orderStatus: 2,
    };
  }
};