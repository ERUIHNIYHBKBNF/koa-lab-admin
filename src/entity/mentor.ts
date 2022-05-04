import { Entity, PrimaryColumn } from 'typeorm';

// https://typeorm.io/entities#column-options
@Entity()
export class Mentor {
  @PrimaryColumn()
  sid: number;

  @PrimaryColumn()
  tid: number;
}
