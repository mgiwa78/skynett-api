import { Entity, Column } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity()
export class Gallery extends BaseEntity {
  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  imageUrl: string;
}
