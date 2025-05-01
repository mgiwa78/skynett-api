import { DataSource } from "typeorm";
import { BaseRepository } from "@repositories/base-repository";
import { PaymentIntent } from "@entities/payment-intent";
import { AppDataSource } from "@config/ormconfig";

export class PaymentIntentRepository extends BaseRepository<PaymentIntent> {
  constructor() {
    super(AppDataSource, PaymentIntent);
  }
}
