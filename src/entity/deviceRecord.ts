import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { Device } from './device';

export enum DeviceStatus {
  BREAKDOWN = 'breakdown',
  ONLINE = 'online',
};

// https://typeorm.io/entities#column-options
@Entity()
export class DeviceRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Device, device => device.records)
  device: Device;

  @Column({
    type: 'enum',
    enum: DeviceStatus,
    default: DeviceStatus.ONLINE,
  })
  operation: DeviceStatus;

  @CreateDateColumn()
  createdAt: Date;
}
