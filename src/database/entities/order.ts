import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user";
import { OrderItem } from "./order-item";
import { Payment } from "./payment";
import { PaymentIntent } from "./payment-intent";
import { BaseEntity } from "./base.entity";

@Entity()
export class Order extends BaseEntity {
  @Column()
  orderRef: string;

  @ManyToOne(() => User, (user) => user.orders)
  customer: User;

  @Column({ type: "json", nullable: true })
  shippingAddress: any;

  @Column({ default: "pending" })
  status: string;

  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];

  @OneToMany(() => Payment, (payment) => payment.order)
  payments: Payment[];

  @OneToMany(() => PaymentIntent, (intent) => intent.order)
  paymentIntents: PaymentIntent[];

  @Column("decimal", { precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: "json", nullable: true })
  paymentDetails: any;
}
