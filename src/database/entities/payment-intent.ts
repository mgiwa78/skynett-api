import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Order } from "./order";

@Entity()
export class PaymentIntent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  intentId: string; // External ID from payment gateway

  @ManyToOne(() => Order, (order) => order.paymentIntents)
  order: Order;

  @Column({ default: "pending" })
  status: string; // pending, confirmed, failed

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
