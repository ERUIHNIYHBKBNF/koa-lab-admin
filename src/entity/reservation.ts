import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user';
import { Device } from './device';
import { ReservationRecord } from './reservationRecord';

export enum ReservationStatus {
  PENDING_TEACHER = 'pending_teacher',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
};

// https://typeorm.io/entities#column-options
@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => User)
  user: User;

  @ManyToOne(type => Device)
  device: Device;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.PENDING_TEACHER,
  })
  status: ReservationStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(type => ReservationRecord, record => record.reservation)
  reservationRecords: ReservationRecord[];
}
