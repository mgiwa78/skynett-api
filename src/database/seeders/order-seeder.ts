import { Order } from "../entities/order";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

export default class OrderSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const orderRepository = dataSource.getRepository(Order);

    const orders = [
      { status: "completed", totalAmount: 500 },
      { status: "pending", totalAmount: 1000 },
    ];

    for (const orderData of orders) {
      const order = orderRepository.create(orderData);
      await orderRepository.save(order);
    }

    console.log("Order seeder completed.");
  }
}
