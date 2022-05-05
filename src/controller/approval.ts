import { Context } from 'koa';
import { Manager } from '../server';
import { User, UserRole } from '../entity/user';
import { Session } from '../entity/session';
import { Reservation, ReservationStatus } from '../entity/reservation';
import { ReservationRecord, ReservationOperationStatus } from '../entity/reservationRecord';

export default class AppovalController {
  public static async getApprovals(ctx: Context) {
    const sessionRepository = Manager.getRepository(Session);
    const session = await sessionRepository.createQueryBuilder("session").leftJoinAndSelect("session.user", "user").where("session.id = :id", {id: ctx.cookies.get('session')}).getOne();
    if (!session) {
      ctx.status = 401;
      return;
    }
    if (session.user.type != UserRole.ADMIN && session.user.type != UserRole.TEACHER) {
      ctx.status = 401;
      return;
    }
    const reservationRepository = Manager.getRepository(Reservation);
    if (session.user.type == UserRole.ADMIN) {
      const reservations = await reservationRepository.createQueryBuilder("reservation").leftJoinAndSelect("reservation.device", "device").leftJoinAndSelect("reservation.user", "user").where("reservation.status = :status", {status: ReservationStatus.PENDING}).getMany();
      ctx.status = 200;
      ctx.body = reservations;
    } else {
      const reservations = await reservationRepository.createQueryBuilder("reservation").leftJoinAndSelect("reservation.device", "device").leftJoinAndSelect("reservation.user", "user").where("reservation.status = :status", {status: ReservationStatus.PENDING_TEACHER}).getMany();
      const userRepository = Manager.getRepository(User);
      const teacher = await userRepository.findOne({
        where: {
          id: session.user.id,
        },
        relations: {
          students: true,
        },
      });
      const students = teacher!.students.map(s => s.id);
      ctx.body = reservations.filter((r: Reservation) => {
        return students.includes(r.user.id);
      });
    }
  }
  public static async setApproval(ctx: Context) {
    const sessionRepository = Manager.getRepository(Session);
    const session = await sessionRepository.createQueryBuilder("session").leftJoinAndSelect("session.user", "user").where("session.id = :id", {id: ctx.cookies.get('session')}).getOne();
    if (!session) {
      ctx.status = 401;
      return;
    }
    if (session.user.type != UserRole.ADMIN && session.user.type != UserRole.TEACHER) {
      ctx.status = 401;
      return;
    }
    if (!ctx.request.body.operation || !ctx.request.body.reservationId) {
      ctx.status = 400;
      return;
    }
    const reservationRepository = Manager.getRepository(Reservation);
    const reservation = await reservationRepository.createQueryBuilder("reservation").leftJoinAndSelect("reservation.device", "device").leftJoinAndSelect("reservation.user", "user").where("reservation.id = :id", {id: ctx.request.body.reservationId}).getOne();
    if (!reservation) {
      ctx.status = 404;
      return;
    }
    if (session.user.type === UserRole.ADMIN) {
      if (reservation.status != ReservationStatus.PENDING) {
        ctx.status = 400;
        return;
      }
      Manager.transaction(async (manager) => {
        const reservationRecordRepository = manager.getRepository(ReservationRecord);
        reservation.status = ctx.request.body.operation == ReservationOperationStatus.APPROVED ? ReservationStatus.APPROVED : ReservationStatus.REJECTED;
        await reservationRepository.update(reservation.id, reservation);
        const reservationRecord = new ReservationRecord();
        reservationRecord.reservation = reservation;
        reservationRecord.operator = session.user;
        reservationRecord.operation = ctx.request.body.operation;
        await reservationRecordRepository.save(reservationRecord);
        ctx.body = reservationRecord;
      });
      ctx.status = 200;
    } else if (session.user.type === UserRole.TEACHER) {
      if (reservation.status != ReservationStatus.PENDING_TEACHER) {
        ctx.status = 400;
        return;
      }
      Manager.transaction(async (manager) => {
        const reservationRecordRepository = manager.getRepository(ReservationRecord);
        reservation.status = ctx.request.body.operation == ReservationOperationStatus.APPROVED ? ReservationStatus.PENDING : ReservationStatus.REJECTED;
        await reservationRepository.update(reservation.id, reservation);
        const reservationRecord = new ReservationRecord();
        reservationRecord.reservation = reservation;
        reservationRecord.operator = session.user;
        reservationRecord.operation = ctx.request.body.operation;
        await reservationRecordRepository.save(reservationRecord);
        ctx.body = reservationRecord;
      });
      ctx.status = 200;
    }
  }
}
