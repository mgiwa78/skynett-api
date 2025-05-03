import { DataSource } from "typeorm";
import { BaseRepository } from "@repositories/base.repository";
import { AppDataSource } from "@config/ormconfig";
import { Feedback } from "@entities/feedback";

export class FeedbackRepository extends BaseRepository<Feedback> {
  constructor() {
    super(AppDataSource, Feedback);
  }

  protected getSearchableColumns(): string[] {
    return ["content", "customer", "title", "customer_profile"];
  }
}
