import { DataSource } from "typeorm";
import { BaseRepository } from "@repositories/base-repository";
import { AppDataSource } from "@config/ormconfig";
import { Payment } from "@entities/payment";

export class PaymentRepository extends BaseRepository<Payment> {
  constructor() {
    super(AppDataSource, Payment);
  }
}
