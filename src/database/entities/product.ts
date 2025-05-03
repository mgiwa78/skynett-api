import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { Category } from "./category";
import { Brand } from "./brand";
import { BaseEntity } from "./base.entity";

export enum ProductStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  PENDING = "pending",
}

@Entity()
export class Product extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  discountedPrice: number;

  @Column({ nullable: true })
  image: string;

  @Column("simple-array", { nullable: true })
  otherImages: string[];

  @Column()
  stock: number;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @ManyToMany(() => Brand, (brand) => brand.products)
  @JoinTable({
    name: "product_brands",
    joinColumn: {
      name: "productId",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "brandId",
      referencedColumnName: "id",
    },
  })
  brands: Brand[];

  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable({
    name: "product_categories",
    joinColumn: {
      name: "productId",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "categoryId",
      referencedColumnName: "id",
    },
  })
  categories: Category[];

  @Column({ type: "enum", enum: ProductStatus })
  status: ProductStatus;
}
