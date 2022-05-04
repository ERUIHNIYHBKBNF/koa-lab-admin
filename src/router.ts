// src/routes.ts
import Router from '@koa/router';

import AuthController from './controller/auth';
import UserController from './controller/user';

const router = new Router();

// auth 相关的路由
router.post('/auth/login', AuthController.login);
router.post('/auth/register', AuthController.register);

// users 相关的路由
router.get('/users', UserController.listUsers);
router.get('/users/:id', UserController.showUserDetail);
router.post('/users/:id', UserController.updateUser);
router.delete('/users/:id', UserController.deleteUser);

export default router;
