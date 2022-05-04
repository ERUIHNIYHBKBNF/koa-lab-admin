import { Context } from 'koa';
import { Manager } from '../server';
import { UserRole } from '../entity/user';
import { Notice } from '../entity/notice';
import { Session } from '../entity/session';

export default class NoticeController {
  public static async getNotices(ctx: Context) {
    const noticeRepository = Manager.getRepository(Notice);
    const notices: Notice[] = await noticeRepository.find();
    ctx.status = 200;
    ctx.body = notices;
  }

  public static async createNotice(ctx: Context) {
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
    const noticeRepository = Manager.getRepository(Notice);
    const notice = new Notice();
    notice.content = ctx.request.body.content;
    await noticeRepository.save(notice);
    ctx.status = 200;
    ctx.body = notice;
  }

  public static async updateNotice(ctx: Context) {
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
    const noticeRepository = Manager.getRepository(Notice);
    const notice = await noticeRepository.findOneBy({id: ctx.request.body.id});
    if (!notice) {
      ctx.status = 404;
      return;
    }
    notice.content = ctx.request.body.content;
    await noticeRepository.update(notice.id, notice);
    ctx.status = 200;
    ctx.body = notice;
  }
}
