import { DataSource } from "typeorm";
import { BaseRepository } from "./base.repository";
import { Order } from "../database/entities/order";
import { AppDataSource } from "../config/ormconfig";

export class OrderRepository extends BaseRepository<Order> {
  protected defaultRelations: string[] = ["items", "items.product"];

  constructor() {
    super(AppDataSource, Order);
  }

  protected getSearchableColumns(): string[] {
    return ["name"];
  }
}
