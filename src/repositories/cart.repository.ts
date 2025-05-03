import { Cart } from "@entities/cart";
import { BaseRepository } from "./base.repository";
import { AppDataSource } from "@config/ormconfig";

export class CartRepository extends BaseRepository<Cart> {
  protected defaultRelations: string[] = ["customer", "items", "items.product"];

  constructor() {
    super(AppDataSource, Cart);
  }

  async findByCustomerId(customerId: string): Promise<Cart | null> {
    return this.findOne({
      where: { customer: { id: customerId } } as any,
      relations: this.defaultRelations,
    });
  }

  async findBySessionId(sessionId: string): Promise<Cart | null> {
    return await this.findOne({
      where: { sessionId },
      relations: this.defaultRelations,
    });
  }
}
