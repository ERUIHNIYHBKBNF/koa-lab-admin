import Router from '@koa/router';

import AuthController from './controller/auth';
import UserController from './controller/user';
import NoticeController from './controller/notice';
import DeviceController from './controller/device';
import ReservationsController from './controller/reservation';
import StudentsController from './controller/students';
import ApprovalController from './controller/approval';

const router = new Router();

// 身份认证
router.post('/auth/login', AuthController.login);
router.post('/auth/register', AuthController.register);

// 用户信息相关
router.get('/users', UserController.listUsers);
router.get('/users/getinfo', UserController.showUserDetail);
router.post('/users', UserController.updateUser);

// 通知相关
router.get('/notices', NoticeController.getNotices);
router.post('/notices/create', NoticeController.createNotice);
router.post('/notices/update', NoticeController.updateNotice);
router.post('/notices/delete', NoticeController.deleteNotice);

// 设备相关
router.get('/devices', DeviceController.getDevices);
router.post('/devices/create', DeviceController.createDevice);
router.post('/devices/update', DeviceController.updateDevice);
router.post('/devices/delete', DeviceController.deleteDevice);

// 预约相关
router.get('/reservations', ReservationsController.getReservations);
router.post('/reservations/create', ReservationsController.createReservation);
router.post('/reservations/revert', ReservationsController.revertReservation);

// 学生管理相关
router.get('/students', StudentsController.getStudentList);
router.post('/students/add', StudentsController.addStudent);
router.post('/students/remove', StudentsController.removeStudent);

// 审批相关
router.get('/approvals', ApprovalController.getApprovals);
router.post('/approvals/set', ApprovalController.setApproval);

export default router;
