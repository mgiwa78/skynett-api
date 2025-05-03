import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity()
export class Coupon extends BaseEntity {
  @Column({ type: "varchar", length: 255 })
  code: string;

  @Column({ type: "float" })
  discountAmount: number;

  @Column({ type: "boolean", default: false })
  isActive: boolean;

  @Column({ type: "timestamp", nullable: true })
  expiresAt: Date | null;

  @Column({ type: "int", default: 0 })
  usageLimit: number;

  @Column({ type: "int", default: 0 })
  timesUsed: number;
}
