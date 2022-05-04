import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, ManyToMany } from 'typeorm';
import { Notice } from './notice';
import { Reservation } from './reservation';
import { ReservationRecord } from './reservationRecord';

export enum UserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
};

// https://typeorm.io/entities#column-options
// https://typeorm.io/decorator-reference#relation-decorators
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  type: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(type => Notice, notice => notice.user)
  notices: Notice[];

  @OneToMany(type => Reservation, reservation => reservation.user)
  reservations: Reservation[];

  @OneToMany(type => ReservationRecord, reservationRecord => reservationRecord.user)
  reservationRecords: ReservationRecord[];

  @ManyToMany(type => User, user => user.students)
  teachers: User[];

  @ManyToMany(type => User, user => user.teachers)
  students: User[];
}
