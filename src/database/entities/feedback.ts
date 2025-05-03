import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity()
export class Feedback extends BaseEntity {
  @Column()
  content: string;

  @Column("text")
  customer: string;

  @Column("text")
  title: string;

  @Column("text")
  customer_profile: string;

  @Column("int")
  rating: number;
}
