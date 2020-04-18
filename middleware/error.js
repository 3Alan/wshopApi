module.exports = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    //错误页面
    console.log("错误中间件");

    console.log(error);
    if (error.status === 401 || error.name === "TokenExpiredError") {
      ctx.body = {
        code: "00004",
        msg: "authenticate failed!",
        error,
      };
      ctx.status = 401;
    } else if (error.status === 40001) {
      ctx.body = {
        code: "00004",
        msg: "微信授权失败请重新登录",
        error,
      };
    } else {
      ctx.body = {
        code: "500",
        msg: "不要意思，服务器开小差了，请稍后再试！",
        error,
      };
    }
  }
};
