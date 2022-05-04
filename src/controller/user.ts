// src/controllers/user.ts
import { Context } from 'koa';
import { Manager } from '../server';
import { User, UserRole } from '../entity/user';
import { Session } from '../entity/session';

export default class UserController {
  public static async listUsers(ctx: Context) {
    const userRepository = Manager.getRepository(User);
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
    const users = await userRepository.find();

    ctx.status = 200;
    ctx.body = users;
  }

  public static async showUserDetail(ctx: Context) {
    const sessionRepository = Manager.getRepository(Session);

    const session = await sessionRepository.createQueryBuilder("session").leftJoinAndSelect("session.user", "user").where("session.id = :id", {id: ctx.cookies.get('session')}).getOne();
    if (!session) {
      ctx.status = 401;
      return;
    }

    ctx.status = 200;
    ctx.body = session.user;
  }

  public static async updateUser(ctx: Context) {
    const userRepository = Manager.getRepository(User);
    const sessionRepository = Manager.getRepository(Session);

    const session = await sessionRepository.createQueryBuilder("session").leftJoinAndSelect("session.user", "user").where("session.id = :id", {id: ctx.cookies.get('session')}).getOne();
    if (!session) {
      ctx.status = 401;
      return;
    }
    let user = session.user;
    if (!ctx.request.body) {
      ctx.status = 400;
      return;
    } else {
      user = Object.assign(user, ctx.request.body);
      await userRepository.update(user.id, user);
      const updatedUser = await userRepository.findOneBy({id: user.id});
      if (updatedUser) {
        ctx.status = 200;
        ctx.body = updatedUser;
      } else {
        ctx.status = 404;
      }
    }
  }
}
