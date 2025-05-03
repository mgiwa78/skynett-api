import { BaseRepository } from "./base.repository";
import { Category } from "../database/entities/category";
import { AppDataSource } from "../config/ormconfig";

export class CategoryRepository extends BaseRepository<Category> {
  protected defaultRelations: string[] = ["products"];

  constructor() {
    super(AppDataSource, Category);
  }

  protected getSearchableColumns(): string[] {
    return ["name"];
  }
}
