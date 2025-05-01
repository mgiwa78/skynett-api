import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Order } from "./order";
import bcrypt from "bcrypt";
import { Notification } from "./notification";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }

  @OneToMany(() => Notification, (notifications) => notifications.user)
  notifications: Notification;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: "customer" })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];
}
