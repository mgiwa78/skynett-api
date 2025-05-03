import { Entity, Column, ManyToOne } from "typeorm";
import { Cart } from "./cart";
import { Product } from "./product";
import { BaseEntity } from "./base.entity";

@Entity()
export class CartItem extends BaseEntity {
  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: "CASCADE" })
  cart: Cart;

  @ManyToOne(() => Product, { eager: true })
  product: Product;

  @Column("int")
  quantity: number;
}
