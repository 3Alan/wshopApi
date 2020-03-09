const jwt = require("jsonwebtoken");
const getToken = require("./auth-header");
const secret = "7e2c71a51284ef29da506282d7311996";

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
