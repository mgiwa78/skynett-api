import { Column, ManyToOne, Entity } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Order } from "./order";
import { Cart } from "./cart";

@Entity()
export class PaymentIntent extends BaseEntity {
  @Column()
  amount: number;

  @Column()
  currency: string;

  @Column()
  reference: string;

  @Column()
  status: string;

  @Column({ nullable: true })
  paymentMethod: string;

  @Column({ nullable: true })
  paymentDate: Date;

  @Column({ type: "json", nullable: true })
  paymentDetails: Record<string, any>;

  @Column({ type: "json", nullable: true })
  metadata: Record<string, any>;

  @Column({ nullable: true })
  email: string;

  @ManyToOne(() => Order, (order) => order.paymentIntents, { nullable: true })
  order: Order;

  @ManyToOne(() => Cart, { nullable: true })
  cart: Cart;
}
