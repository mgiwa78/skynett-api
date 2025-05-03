import { DataSource } from "typeorm";
import { BaseRepository } from "@repositories/base.repository";
import { FAQ } from "@entities/faq";
import { AppDataSource } from "@config/ormconfig";

export class FAQRepository extends BaseRepository<FAQ> {
  constructor() {
    super(AppDataSource, FAQ);
  }

  protected getSearchableColumns(): string[] {
    return ["question", "answer"];
  }
}
