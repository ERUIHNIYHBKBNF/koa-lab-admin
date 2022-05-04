import Koa from 'koa';
import cors from '@koa/cors';
import bodyParser from 'koa-body';
import { DataSource  } from 'typeorm';
import 'reflect-metadata';

import logger from './logger';
import router from './router';

const dbconfig = require('../ormconfig.json');
const dataSource = new DataSource(dbconfig);
dataSource.initialize()
.then(() => {
  // 初始化 Koa 应用实例
  const app = new Koa();

  // 注册中间件
  app.use(logger()); // 打印请求日志
  app.use(cors());
  app.use(bodyParser());

  // 响应用户请求
  app.use(router.routes()).use(router.allowedMethods());

  // 运行服务器
  app.listen(13875);
})
.catch((err) => {
    console.error("Error during Data Source initialization", err)
});
export const Manager = dataSource.manager;
