module.exports=async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    //错误页面
    console.log('错误中间件');
    
    console.log(error);
    if (error.status === 401 || error.name === 'TokenExpiredError') {
      ctx.body = {
        code: '00004',
        msg: 'authenticate failed!',
        error,
      };
      ctx.status = 401;
    } else {
      throw error;
    }
  }
};
