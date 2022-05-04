import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { Device } from './device';

export enum DeviceOperationStatus {
  BREAKDOWN = 'breakdown',
  ONLINE = 'online',
};

// https://typeorm.io/entities#column-options
@Entity()
export class DeviceRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Device)
  device: Device;

  @Column({
    type: 'enum',
    enum: DeviceOperationStatus,
    default: DeviceOperationStatus.ONLINE,
  })
  operation: DeviceOperationStatus;

  @CreateDateColumn()
  createdAt: Date;
}
