import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user";

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  title: string;

  @Column("text")
  message: string;

  @Column({ type: "boolean", default: false })
  status: boolean;

  @Column({ type: "boolean", default: false })
  isRead: boolean;

  @Column({ type: "varchar", length: 255, nullable: true })
  linkType: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  color: string;

  @ManyToOne(() => User, (user) => user.notifications)
  user: User;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @CreateDateColumn({ nullable: true })
  createdAt?: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt?: Date;
}
