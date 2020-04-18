const request = require("request");
const userModel = require("../models/user");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const goodModel = require("../models/good");

const appid = "wxe2f51632adeb6a99";
const { secret } = require("../config");

const createUUID = (username) => {
  const user = username.split("");
  const uuid = [];
  for (let i = 0; i < 5; i++) {
    uuid[i] = user[i]
      ? user[i].charCodeAt()
      : parseInt(Math.random() * 90 + 10, 10);
  }
  return uuid.join("");
};

const updateAccessToken = () => {
  return new Promise((resolve, reject) => {
    request(
      `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`,
      (err, res, body) => {
        if (err) {
          reject(err);
        } else {
          resolve(body);
        }
      }
    );
  });
};

module.exports = {
  wechatLogin: async (ctx, next) => {
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
    const accessResult = await updateAccessToken();
    ctx.body = {
      openid: JSON.parse(result).openid,
      access_token: JSON.parse(accessResult).access_token,
    };
  },

  async login(ctx, next) {
    const { username, password } = ctx.request.body;
    const userValidate = await userModel.checkUser(username, password);

    //验证用户名以及密码
    if (userValidate) {
      const token = jwt.sign({ username, password }, secret, {
        expiresIn: "12h",
      });
      ctx.body = {
        msg: "登录成功！",
        code: "00001",
        token,
      };
    } else {
      ctx.body = {
        msg: "登录失败，请检查用户名及密码是否正确！",
        code: "00002",
        token: null,
      };
    }
    // 返回token
  },

  async register(ctx, next) {
    const { username, password } = ctx.request.body;
    const userExit = await userModel.findUser(username);

    if (!userExit) {
      await userModel.register(username, password);
      ctx.body = {
        msg: "注册成功！",
      };
    } else {
      ctx.body = {
        msg: "用户名已经被注册了",
      };
    }
  },

  async addAddress(ctx, next) {
    const addressInfo = ctx.request.body;
    const { username } = ctx.state.user;
    const Res = await userModel.addAddress(username, addressInfo);
    const msg = Res ? "添加地址成功" : "添加失败请重试";
    const code = Res ? "1" : "0";
    ctx.body = {
      msg,
      code,
    };
  },

  async getAddressList(ctx, next) {
    const { username } = ctx.state.user;
    const addressList = await userModel.getAddressList(username);
    ctx.body = { addressList };
  },

  async checkUserName(ctx, next) {
    const { username } = ctx.request.body;
    const userExit = await userModel.findUser(username);
    ctx.body = { userExit };
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
    const submitTime = moment().format("YYYY-MM-DD hh:mm");
    const orderId = `${new Date().getTime()}${goodId}${createUUID(username)}`;
    await userModel.submitOrder(
      username,
      orderId,
      addressId,
      goodId,
      size,
      submitTime
    );
    const orderDetail = await userModel.getOrderDetail(orderId);
    ctx.body = {
      orderDetail: orderDetail[0],
      res: "success",
      msg: "提交订单成功",
      status: 1,
    };
  },

  async checkUserAccount(ctx, next) {
    const { username } = ctx.state.user;
    const balance = await userModel.checkUserAccount(username);
    ctx.body = balance[0];
  },

  async payForOrder(ctx, next) {
    const { username } = ctx.state.user;
    const { orderId, orderPrice } = ctx.request.body;
    await userModel.payForOrder(username, orderId, orderPrice);
    const goodDetail = await userModel.getOrderGood(orderId);
    const orderDetail = await userModel.getOrderDetail(orderId);
    const { name, price } = goodDetail[0];
    const { time } = orderDetail[0];
    const { touser, template_id, access_token } = ctx.request.body;
    const data = {
      touser,
      template_id,
      data: {
        thing5: {
          value: "该信息仅用于测试！",
        },
        character_string9: {
          value: orderId,
        },
        thing6: {
          value: name,
        },
        amount7: {
          value: price,
        },
        date10: {
          value: time,
        },
      },
      page: `/pages/submitOrder/submitOrder?orderId=${orderId}`,
      miniprogram_state: "trial",
    };
    await new Promise((resolve, reject) => {
      request.post(
        {
          url: `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${access_token}`,
          method: "POST",
          json: true,
          body: data,
        },
        (err, result, body) => {
          if (err) {
            reject(err);
          } else {
            console.log(body);
            
            resolve(body);
          }
        }
      );
    });

    ctx.body = {
      msg: "支付成功！",
      orderStatus: 2,
    };
  },

  async delivery(ctx, next) {
    const { orderId } = ctx.request.body;
    await userModel.delivery(orderId);
    ctx.body = {
      orderStatus: 3,
    };
  },

  async cancelOrder(ctx, next) {
    const { orderId } = ctx.request.body;
    await userModel.cancelOrder(orderId);
    ctx.body = {
      orderStatus: 6,
    };
  },

  async confirmReceiving(ctx, next) {
    const { orderId } = ctx.request.body;
    await userModel.confirmReceiving(orderId);
    ctx.body = {
      orderStatus: 4,
    };
  },

  async getOrderList(ctx, next) {
    const { username } = ctx.state.user;
    const { status } = ctx.request.body;
    const orderList = await userModel.getOrderList(username, status);
    ctx.body = { orderList };
  },

  async getOrderDetail(ctx, next) {
    const { orderId } = ctx.request.query;
    const addressDetail = await userModel.getOrderAddress(orderId);
    const goodDetail = await userModel.getOrderGood(orderId);
    const orderDetail = await userModel.getOrderDetail(orderId);
    ctx.body = {
      addressDetail: addressDetail[0],
      goodDetail: goodDetail[0],
      orderDetail: orderDetail[0],
    };
  },

  async orderEvaluate(ctx, next) {
    const { orderId, comment, commentType } = ctx.request.body;
    await userModel.orderEvaluate(orderId, comment, commentType);
    ctx.body = {
      msg: "评价成功",
    };
  },

  async collectGood(ctx, next) {
    const { goodId } = ctx.request.body;
    const { username } = ctx.state.user;
    const isCollected = await userModel.findUserCollection(username, goodId);
    console.log(isCollected);

    if (isCollected.length != 0) {
      await userModel.toggleCollect(username, goodId);
    } else {
      await userModel.addCollect(username, goodId);
    }

    ctx.body = {
      msg: "success",
    };
  },

  async getCollectionList(ctx, next) {
    const { username } = ctx.state.user;
    const collectionList = await userModel.getCollectionList(username);
    ctx.body = { collectionList };
  },

  async cancelCollect(ctx, next) {
    const { username } = ctx.state.user;
    const { id } = ctx.request.body;
    const collectionList = await userModel.cancelCollect(id);
    ctx.body = { msg: "success" };
  },

  async getHistory(ctx, next) {
    const { username } = ctx.state.user || "";
    const historySearch = await userModel.getHistory(username);
    const hotSearch = await goodModel.getHotSearch();
    ctx.body = {
      historySearch,
      hotSearch,
    };
  },

  async deleteHistory(ctx, next) {
    const { username } = ctx.state.user || "";
    await userModel.deleteHistory(username);
    ctx.body = {
      msg: "success",
    };
  },

  async recharge(ctx, next) {
    const { username } = ctx.state.user || "";
    const { price, password } = ctx.request.body;
    console.log(price);
    console.log(password);

    const userValidate = await userModel.checkUser(username, password);
    console.log(userValidate);

    if (userValidate) {
      await userModel.recharge(username, price);
      ctx.body = {
        code: 1,
        msg: "充值成功！",
      };
    } else {
      ctx.body = {
        code: -1,
        msg: "密码错误！",
      };
    }
  },

  async saveHistorySearch(ctx, next) {
    const { username } = ctx.state.user || "";
    const { searchValue } = ctx.request.body;
    const history = await userModel.findHistory(username, searchValue);
    if (history.length === 0) {
      await userModel.saveHistorySearch(username, searchValue);
    }

    const hotHistory = await goodModel.findHotHistory(searchValue);
    if (hotHistory.length === 0) {
      await goodModel.addHotHistory(searchValue);
    } else {
      await goodModel.updateHotHistory(searchValue);
    }
    ctx.body = {
      msg: "success",
    };
  },
};
