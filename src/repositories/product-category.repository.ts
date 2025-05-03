import { DataSource } from "typeorm";
import { BaseRepository } from "@repositories/base.repository";
import { Payment } from "@entities/payment";
import { AppDataSource } from "@config/ormconfig";

export class PaymentRepository extends BaseRepository<Payment> {
  constructor() {
    super(AppDataSource, Payment);
  }
}
