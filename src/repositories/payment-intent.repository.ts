import { AppDataSource } from "../config/ormconfig";
import { BaseRepository } from "./base.repository";
import { PaymentIntent } from "../database/entities/payment-intent";

export class PaymentIntentRepository extends BaseRepository<PaymentIntent> {
  constructor() {
    super(AppDataSource, PaymentIntent);
  }

  protected getSearchableColumns(): string[] {
    return ["reference", "status"];
  }
}
