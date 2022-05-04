import { Column, Entity, Generated, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user';

@Entity()
export class Session {
  @PrimaryColumn()
  @Generated('uuid')
  id: string;

  @ManyToOne(type => User)
  user: User;
}
