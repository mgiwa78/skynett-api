import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Customer } from "./customer";
import { CartItem } from "./cart-item";

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer)
  customer: Customer;

  @OneToMany(() => CartItem, (item) => item.cart)
  items: CartItem[];

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @CreateDateColumn({ nullable: true })
  createdAt?: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt?: Date;
}
