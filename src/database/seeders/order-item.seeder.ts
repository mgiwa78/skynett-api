import { OrderItem } from "../entities/order-item";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

export default class OrderItemSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const orderItemRepository = dataSource.getRepository(OrderItem);

    const items = [
      { quantity: 2, price: 100 },
      { quantity: 1, price: 500 },
    ];

    for (const itemData of items) {
      const orderItem = orderItemRepository.create(itemData);
      await orderItemRepository.save(orderItem);
    }

    console.log("OrderItem seeder completed.");
  }
}
