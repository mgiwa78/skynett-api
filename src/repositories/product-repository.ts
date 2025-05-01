import { DataSource } from "typeorm";
import { BaseRepository } from "@repositories/base-repository";
import { Product } from "@entities/product";
import { AppDataSource } from "@config/ormconfig";

export class ProductRepository extends BaseRepository<Product> {
  protected defaultRelations: string[] = ["category"];

  constructor() {
    super(AppDataSource, Product);
  }
}
