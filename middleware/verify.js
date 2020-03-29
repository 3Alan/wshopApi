const jwt = require("jsonwebtoken");
// 用来获取客户端发送请求中的token
const getToken = require("./auth-header");
const { secret } = require('../config');

// 用来验证token是否有效
function verify(...args) {
  return new Promise((resolve, reject) => {
    jwt.verify(...args, (error, decoded) => {
      error ? reject(error) : resolve(decoded);
    });
  });
}

module.exports = async (ctx, next) => {
    const token = getToken(ctx);
    if (token) {
      const user = await verify(token, secret); // 把token解析回之前的数据
      ctx.state.user = user; // 将获取的用户信息保存到全局的state中
    }

  await next();
};
