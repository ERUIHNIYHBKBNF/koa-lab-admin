import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';

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

  // @ManyToMany(type => User, user => user.students, { cascade: true })
  // @JoinTable({
  //   name: "mentor",
  //   joinColumn: { name: "sid", referencedColumnName: "id" },
  //   inverseJoinColumn: { name: "tid", referencedColumnName: "id" },
  // })
  // teachers: User[];

  @ManyToMany(type => User, user => user, { cascade: true })
  @JoinTable({
    name: "mentor",
    joinColumn: { name: "tid", referencedColumnName: "id" },
    inverseJoinColumn: { name: "sid", referencedColumnName: "id" },
  })
  students: User[];
}
