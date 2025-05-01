import { BaseRepository } from "@repositories/base-repository";
import { Category } from "@entities/category";
import { AppDataSource } from "@config/ormconfig";

export class CategoryRepository extends BaseRepository<Category> {
  protected defaultRelations: string[] = ["products"];

  constructor() {
    super(AppDataSource, Category);
  }
}
