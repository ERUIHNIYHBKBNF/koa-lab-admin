import Router from '@koa/router';

import AuthController from './controller/auth';
import UserController from './controller/user';

const router = new Router();

// 身份认证
router.post('/auth/login', AuthController.login);
router.post('/auth/register', AuthController.register);

// 用户信息相关
router.get('/users', UserController.listUsers);
router.get('/users/getinfo', UserController.showUserDetail);
router.post('/users', UserController.updateUser);

export default router;
