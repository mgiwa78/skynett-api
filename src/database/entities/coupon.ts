import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Coupon {
  @PrimaryGeneratedColumn()
  id: number;

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

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @CreateDateColumn({ nullable: true })
  createdAt?: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt?: Date;
}
