import { Context } from 'koa';
import { Manager } from '../server';
import { User } from '../entity/user';
import { Session } from '../entity/session';

export default class AuthController {
  public static async login(ctx: Context) {
    const userRepository = Manager.getRepository(User);
    const sessionRepository = Manager.getRepository(Session);
    const user = await userRepository.findOneBy({username: ctx.request.body.username});
    if (!user) {
      ctx.status = 404;
      return;
    }
    console.log(user);
    
    if (ctx.request.body.password == user.password) {
      const session = new Session();
      session.userId = user.id;
      await sessionRepository.save(session);
      ctx.cookies.set('session', session.id);
      ctx.status = 200;
    } else {
      ctx.status = 401;
      return;
    }
  }

  public static async register(ctx: Context) {
    const userRepository = Manager.getRepository(User);
    const userName = ctx.request.body.username;
    if (await userRepository.findOneBy({username: userName})) {
      ctx.status = 409;
      return;
    }
    const user = new User();
    user.username = ctx.request.body.username;
    user.password = ctx.request.body.password;
    user.type = ctx.request.body.type;
    await userRepository.save(user);
    ctx.status = 200;
  }
}
