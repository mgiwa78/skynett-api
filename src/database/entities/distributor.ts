import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { Product } from "./product";
import { BaseEntity } from "./base.entity";

@Entity()
export class Distributor extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column("text", { nullable: true })
  address: string;

  @OneToMany(() => Product, (product) => product)
  products: Product[];
}
