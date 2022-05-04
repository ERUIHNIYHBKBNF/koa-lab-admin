import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, ManyToMany } from 'typeorm';
import { DeviceRecord } from './deviceRecord';
import { Reservation } from './reservation';

export enum DeviceStatus {
  ONLINE = 'online',
  BORROWED = 'borrowed',
  BROKEN = 'broken',
};

// https://typeorm.io/entities#column-options
@Entity()
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: DeviceStatus,
    default: DeviceStatus.ONLINE,
  })
  status: DeviceStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(type => DeviceRecord, record => record.device)
  records: DeviceRecord[];

  @OneToMany(type => Reservation, reservation => reservation.device)
  reservations: Reservation[];
}
