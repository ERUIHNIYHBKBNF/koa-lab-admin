import { Context } from 'koa';
import { Manager } from '../server';
import { UserRole } from '../entity/user';
import { Session } from '../entity/session';
import { Reservation, ReservationStatus } from '../entity/reservation';
import { Device, DeviceStatus } from '../entity/device';

export default class ReservationsController {
  public static async getReservations(ctx: Context) {
    const sessionRepository = Manager.getRepository(Session);
    const session = await sessionRepository.createQueryBuilder("session").leftJoinAndSelect("session.user", "user").where("session.id = :id", {id: ctx.cookies.get('session')}).getOne();
    if (!session) {
      ctx.status = 401;
      return;
    }
    const reservationRepository = Manager.getRepository(Reservation);
    const reservations = await reservationRepository.createQueryBuilder("reservation").leftJoinAndSelect("reservation.device", "device").leftJoinAndSelect("reservation.user", "user").where("user.id = :id", {id: session.user.id}).getMany();
    ctx.status = 200;
    ctx.body = reservations;
  }

  public static async createReservation(ctx: Context) {
    const sessionRepository = Manager.getRepository(Session);
    const session = await sessionRepository.createQueryBuilder("session").leftJoinAndSelect("session.user", "user").where("session.id = :id", {id: ctx.cookies.get('session')}).getOne();
    if (!session) {
      ctx.status = 401;
      return;
    }
    if (!ctx.request.body || !ctx.request.body.deviceId) {
      ctx.status = 400;
      return;
    }
    const device = await Manager.getRepository(Device).findOneBy({id: ctx.request.body.deviceId});
    if (!device || device.status != DeviceStatus.ONLINE) {
      ctx.status = 404;
      return;
    }
    const reservationRepository = Manager.getRepository(Reservation);
    const reservation = new Reservation();
    reservation.user = session.user;
    reservation.device = device;
    if (session.user.type === UserRole.STUDENT) {
      reservation.status = ReservationStatus.PENDING_TEACHER;
    } else {
      reservation.status = ReservationStatus.PENDING;
    }
    await reservationRepository.save(reservation);
    ctx.status = 200;
    ctx.body = reservation;
  }

  // revert
  public static async revertReservation(ctx: Context) {
    const sessionRepository = Manager.getRepository(Session);
    const session = await sessionRepository.createQueryBuilder("session").leftJoinAndSelect("session.user", "user").where("session.id = :id", {id: ctx.cookies.get('session')}).getOne();
    if (!session) {
      ctx.status = 401;
      return;
    }
    if (!ctx.request.body || !ctx.request.body.reservationId) {
      ctx.status = 400;
      return;
    }
    const reservationRepository = Manager.getRepository(Reservation);
    const reservation = await reservationRepository.createQueryBuilder("reservation").leftJoinAndSelect("reservation.user", "user").where("reservation.id = :id", {id: ctx.request.body.reservationId}).getOne();
    if (!reservation) {
      ctx.status = 404;
      return;
    }
    if (reservation.user.id != session.user.id) {
      ctx.status = 403;
      return;
    }
    reservation.status = ReservationStatus.CANCELLED;
    await reservationRepository.update(reservation.id, reservation);
    ctx.status = 200;
    ctx.body = reservation;
  }
}
