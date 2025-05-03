import { DataSource } from "typeorm";
import { BaseRepository } from "./base.repository";
import { Order } from "../database/entities/order";
import { AppDataSource } from "../config/ormconfig";

export class OrderRepository extends BaseRepository<Order> {
  constructor() {
    super(AppDataSource, Order);
  }

  protected getSearchableColumns(): string[] {
    return ["name"];
  }
}
