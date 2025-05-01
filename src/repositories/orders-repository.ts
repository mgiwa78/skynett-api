import { DataSource } from "typeorm";
import { BaseRepository } from "@repositories/base-repository";
import { Order } from "@entities/order";
import { AppDataSource } from "@config/ormconfig";

export class OrderRepository extends BaseRepository<Order> {
  constructor() {
    super(AppDataSource, Order);
  }
}
