import { Column } from "typeorm";
import { BaseEntity } from "./base.entity";

export class FAQ extends BaseEntity {
  @Column()
  question: string;

  @Column()
  answer: string;
}
