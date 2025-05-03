import { DataSource } from "typeorm";
import { BaseRepository } from "./base.repository";
import { AppDataSource } from "../config/ormconfig";
import { Payment } from "../database/entities/payment";

export class PaymentRepository extends BaseRepository<Payment> {
  constructor() {
    super(AppDataSource, Payment);
  }

  protected getSearchableColumns(): string[] {
    return ["status", "reference"];
  }
}
