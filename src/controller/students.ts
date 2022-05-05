import { Context } from 'koa';
import { Manager } from '../server';
import { User, UserRole } from '../entity/user';
import { Session } from '../entity/session';

export default class StudentController {
  public static async getStudentList(ctx: Context) {
    const sessionRepository = Manager.getRepository(Session);
    const session = await sessionRepository.createQueryBuilder("session").leftJoinAndSelect("session.user", "user").where("session.id = :id", {id: ctx.cookies.get('session')}).getOne();
    if (!session) {
      ctx.status = 401;
      return;
    }
    if (session.user.type != UserRole.TEACHER) {
      ctx.status = 401;
      return;
    }
    const userRepository = Manager.getRepository(User);
    const teacher = await userRepository.findOne({
      where: {
        id: session.user.id,
      },
      relations: {
        students: true,
      },
    });
    ctx.body = teacher!.students;
    ctx.status = 200;
  }
  public static async addStudent(ctx: Context) {
    const sessionRepository = Manager.getRepository(Session);
    const session = await sessionRepository.createQueryBuilder("session").leftJoinAndSelect("session.user", "user").where("session.id = :id", {id: ctx.cookies.get('session')}).getOne();
    if (!session) {
      ctx.status = 401;
      return;
    }
    if (session.user.type != UserRole.TEACHER) {
      ctx.status = 401;
      return;
    }
    if (!ctx.request.body || !ctx.request.body.sid) {
      ctx.status = 400;
      return;
    }
    const userRepository = Manager.getRepository(User);
    const student = await userRepository.findOneBy({id: ctx.request.body.sid});
    if (!student) {
      ctx.status = 404;
      return;
    }
    if (student.type != UserRole.STUDENT) {
      ctx.status = 400;
      return;
    }
    const teacher = await userRepository.findOne({
      where: {
        id: session.user.id,
      },
      relations: {
        students: true,
      },
    });
    if (teacher!.students.find((s: User) => s.id === student.id)) {
      ctx.status = 200;
      return;
    } else {
      teacher!.students.push(student);
      await userRepository.save(teacher!);
      ctx.status = 200;
    }
  }
  public static async removeStudent(ctx: Context) {
    const sessionRepository = Manager.getRepository(Session);
    const session = await sessionRepository.createQueryBuilder("session").leftJoinAndSelect("session.user", "user").where("session.id = :id", {id: ctx.cookies.get('session')}).getOne();
    if (!session) {
      ctx.status = 401;
      return;
    }
    if (session.user.type != UserRole.TEACHER) {
      ctx.status = 401;
      return;
    }
    if (!ctx.request.body || !ctx.request.body.sid) {
      ctx.status = 400;
      return;
    }
    const userRepository = Manager.getRepository(User);
    const student = await userRepository.findOneBy({id: ctx.request.body.sid});
    if (!student) {
      ctx.status = 404;
      return;
    }
    if (student.type != UserRole.STUDENT) {
      ctx.status = 400;
      return;
    }
    const teacher = await userRepository.findOne({
      where: {
        id: session.user.id,
      },
      relations: {
        students: true,
      },
    });
    const index = teacher!.students.findIndex((s: User) => s.id === student.id);
    if (index === -1) {
      ctx.status = 200;
      return;
    } else {
      teacher!.students.splice(index, 1);
      await userRepository.save(teacher!);
      ctx.status = 200;
    }
  }
}
