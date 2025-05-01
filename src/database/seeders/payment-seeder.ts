import { Payment } from "../entities/payment";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

export default class PaymentSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const paymentRepository = dataSource.getRepository(Payment);

    const payments = [
      { amount: 500, paymentMethod: "Credit Card", status: "completed" },
      { amount: 1000, paymentMethod: "PayPal", status: "pending" },
    ];

    for (const paymentData of payments) {
      const payment = paymentRepository.create(paymentData);
      await paymentRepository.save(payment);
    }

    console.log("Payment seeder completed.");
  }
}
