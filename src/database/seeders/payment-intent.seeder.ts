import { PaymentIntent } from "../entities/payment-intent";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

export default class PaymentIntentSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const paymentIntentRepository = dataSource.getRepository(PaymentIntent);

    const intents = [
      { reference: "intent_123", status: "pending" },
      { reference: "intent_456", status: "confirmed" },
    ];

    for (const intentData of intents) {
      const intentExists = await paymentIntentRepository.findOne({
        where: { reference: intentData.reference },
      });

      if (!intentExists) {
        const paymentIntent = paymentIntentRepository.create(intentData);
        await paymentIntentRepository.save(paymentIntent);
      }
    }

    console.log("PaymentIntent seeder completed.");
  }
}
