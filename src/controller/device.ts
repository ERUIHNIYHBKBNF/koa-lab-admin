import { Context } from 'koa';
import { Manager } from '../server';
import { UserRole } from '../entity/user';
import { Device, DeviceStatus } from '../entity/device';
import { DeviceRecord, DeviceOperationStatus } from '../entity/deviceRecord';
import { Session } from '../entity/session';

export default class UserController {
  public static async getDevices(ctx: Context) {
    const deviceRepository = Manager.getRepository(Device);
    const devices: Device[] = await deviceRepository.find();
    ctx.status = 200;
    ctx.body = devices;
  }

  public static async createDevice(ctx: Context) {
    const sessionRepository = Manager.getRepository(Session);
    const session = await sessionRepository.createQueryBuilder("session").leftJoinAndSelect("session.user", "user").where("session.id = :id", {id: ctx.cookies.get('session')}).getOne();
    if (!session) {
      ctx.status = 401;
      return;
    }
    if (session.user.type != UserRole.ADMIN) {
      ctx.status = 401;
      return;
    }
    if (!ctx.request.body || !ctx.request.body.name) {
      ctx.status = 400;
      return;
    }
    const deviceRepository = Manager.getRepository(Device);
    const device = new Device();
    device.name = ctx.request.body.name;
    await deviceRepository.save(device);
    ctx.status = 200;
    ctx.body = device;
  }

  public static async updateDevice(ctx: Context) {
    const sessionRepository = Manager.getRepository(Session);
    const session = await sessionRepository.createQueryBuilder("session").leftJoinAndSelect("session.user", "user").where("session.id = :id", {id: ctx.cookies.get('session')}).getOne();
    if (!session) {
      ctx.status = 401;
      return;
    }
    if (session.user.type != UserRole.ADMIN) {
      ctx.status = 401;
      return;
    }
    if (!ctx.request.body) {
      ctx.status = 400;
      return;
    }
    const deviceRepository = Manager.getRepository(Device);
    const device = await deviceRepository.findOneBy({id: ctx.request.body.id});
    if (!device) {
      ctx.status = 404;
      return;
    }
    device.name = ctx.request.body.name || device.name;
    if (ctx.request.body.status === DeviceStatus.BROKEN) {
      Manager.transaction(async (manager) => {
        device.status = ctx.request.body.status;
        await deviceRepository.update(device.id, device);
        const deviceRecordRepository = manager.getRepository(DeviceRecord);
        const deviceRecord = new DeviceRecord();
        deviceRecord.device = device;
        deviceRecord.operation = DeviceOperationStatus.BREAKDOWN;
        await deviceRecordRepository.save(deviceRecord);
      });
    } else {
      device.status = ctx.request.body.status || device.status;
      await deviceRepository.update(device.id, device);
    }
    ctx.status = 200;
    ctx.body = device;
  }
  public static async deleteDevice(ctx: Context) {
    const sessionRepository = Manager.getRepository(Session);
    const session = await sessionRepository.createQueryBuilder("session").leftJoinAndSelect("session.user", "user").where("session.id = :id", {id: ctx.cookies.get('session')}).getOne();
    if (!session) {
      ctx.status = 401;
      return;
    }
    if (session.user.type != UserRole.ADMIN) {
      ctx.status = 401;
      return;
    }
    if (!ctx.request.body || !ctx.request.body.id) {
      ctx.status = 400;
      return;
    }
    const deviceRepository = Manager.getRepository(Device);
    const device = await deviceRepository.findOneBy({id: ctx.request.body.id});
    if (!device) {
      ctx.status = 404;
      return;
    }
    await deviceRepository.createQueryBuilder().softDelete().where("id = :id", {id: ctx.request.body.id}).execute();
    ctx.status = 200;
  }
}
