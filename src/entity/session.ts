import { Column, Entity, Generated, PrimaryColumn } from 'typeorm';

@Entity()
export class Session {
  @PrimaryColumn()
  @Generated('uuid')
  id: string;

  @Column()
  userId: number;
}
