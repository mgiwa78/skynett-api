import { Entity, ManyToOne, OneToMany, Column } from "typeorm";
import { Customer } from "./customer";
import { CartItem } from "./cart-item";
import { BaseEntity } from "./base.entity";

@Entity()
export class Cart extends BaseEntity {
  @ManyToOne(() => Customer, { nullable: true })
  customer: Customer | null;

  @Column({ nullable: true })
  sessionId: string;

  @OneToMany(() => CartItem, (item) => item.cart, {
    cascade: true,
    eager: true,
    onDelete: "CASCADE",
  })
  items: CartItem[];
}
