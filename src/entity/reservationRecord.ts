import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne } from 'typeorm';
import { User } from './user';
import { Reservation } from './reservation';

export enum ReservationOperationStatus {
  APPROVED = 'approved',
  REJECTED = 'rejected',
};

// https://typeorm.io/entities#column-options
@Entity()
export class ReservationRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => User)
  operator: User;

  @ManyToOne(type => Reservation)
  reservation: Reservation;

  @Column({
    type: 'enum',
    enum: ReservationOperationStatus,
    default: ReservationOperationStatus.APPROVED,
  })
  operation: ReservationOperationStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
