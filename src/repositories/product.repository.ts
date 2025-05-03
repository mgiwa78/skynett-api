import { DataSource } from "typeorm";
import { BaseRepository } from "./base.repository";
import { Product } from "../database/entities/product";
import { AppDataSource } from "../config/ormconfig";

export class ProductRepository extends BaseRepository<Product> {
  protected defaultRelations: string[] = ["brands", "categories"];

  constructor() {
    super(AppDataSource, Product);
  }

  protected getSearchableColumns(): string[] {
    return ["name"];
  }
}
