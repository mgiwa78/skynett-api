import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { User } from "./user";
import { BaseEntity } from "./base.entity";

@Entity()
export class Project extends BaseEntity {
  @Column()
  name: string;

  @Column("text")
  description: string;

  @Column({ nullable: true })
  location: string;

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  budget: number;

  @ManyToOne(() => User, (user) => user.id)
  createdBy: User;
}
