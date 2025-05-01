import { PaymentIntent } from "../entities/payment-intent";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

export default class PaymentIntentSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const paymentIntentRepository = dataSource.getRepository(PaymentIntent);

    const intents = [
      { intentId: "intent_123", status: "pending" },
      { intentId: "intent_456", status: "confirmed" },
    ];

    for (const intentData of intents) {
      const intentExists = await paymentIntentRepository.findOne({
        where: { intentId: intentData.intentId },
      });

      if (!intentExists) {
        const paymentIntent = paymentIntentRepository.create(intentData);
        await paymentIntentRepository.save(paymentIntent);
      }
    }

    console.log("PaymentIntent seeder completed.");
  }
}
