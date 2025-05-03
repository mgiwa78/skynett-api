import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { Order } from "./order";
import { BaseEntity } from "./base.entity";

@Entity()
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("decimal", { precision: 10, scale: 2 })
  amount: number;

  @Column({ default: "pending" })
  status: string;

  @ManyToOne(() => Order, (order) => order.payments)
  order: Order;

  @Column()
  paymentMethod: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  reference: string;
}
