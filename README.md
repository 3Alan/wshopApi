# wshopApi
**wshop的Api**
***
```
wshopApi
 ├── app.js                                //项目的入口文件
 ├── config.js				//项目的配置文件
 ├── controllers				//控制层，处理不同路由对应的逻辑
 │   ├── good.js				//有关商品的控制层
 │   └── user.js				//有关用户的控制层
 ├── middleware				//中间层，处理一些问题
 │   ├── auth-header.js			//处理请求头中的token数据
 │   ├── error.js				//错误处理中间件
 │   └── verify.js			//用户校权
 ├── models				//数据持久层
 │   ├── db.js				//mysql相关配置处理
 │   ├── good.js				//有关商品的持久层
 │   └── user.js				//有关用户的持久层
 ├── package-lock.json
 ├── package.json
 ├── README.md
 └── routers				//路由层
     ├── good.js				//有关商品的路由层
     └── user.js				//有关用户的路由层

```

**运行方式：**
***
```
npm install
nodemon ./app.js
```
