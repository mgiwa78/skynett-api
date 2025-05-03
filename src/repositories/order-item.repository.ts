import { DataSource } from "typeorm";
import { BaseRepository } from "@repositories/base.repository";
import { OrderItem } from "@entities/order-item";
import { AppDataSource } from "@config/ormconfig";

export class OrderItemRepository extends BaseRepository<OrderItem> {
  constructor() {
    super(AppDataSource, OrderItem);
  }
}
