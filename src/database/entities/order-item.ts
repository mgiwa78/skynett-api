import { Entity, ManyToOne, Column } from "typeorm";
import { Order } from "./order";
import { Product } from "./product";
import { BaseEntity } from "./base.entity";

@Entity()
export class OrderItem extends BaseEntity {
  @ManyToOne(() => Order, (order) => order.items)
  order: Order;

  @ManyToOne(() => Product)
  product: Product;

  @Column()
  quantity: number;

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;
}
