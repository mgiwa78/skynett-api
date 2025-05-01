import { Cart } from "database/entities/cart";
import { BaseRepository } from "./base-repository";
import { AppDataSource } from "@config/ormconfig";

export class CartRepository extends BaseRepository<Cart> {
  constructor() {
    super(AppDataSource, Cart);
  }
}
