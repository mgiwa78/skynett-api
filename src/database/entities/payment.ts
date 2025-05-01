import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { Order } from "./order";

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("decimal", { precision: 10, scale: 2 })
  amount: number;

  @Column({ default: "pending" })
  status: string;

  @ManyToOne(() => Order, (order) => order.payments)
  order: Order;

  @Column()
  paymentMethod: string; // E.g., Credit Card, PayPal

  @CreateDateColumn()
  createdAt: Date;
}
