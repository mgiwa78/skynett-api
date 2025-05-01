import { FAQ } from "../entities/faq";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

export default class FAQSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const faqRepository = dataSource.getRepository(FAQ);

    const faqs = [
      {
        question: "What is renewable energy?",
        answer:
          "Renewable energy is energy collected from resources that are naturally replenished.",
      },
      {
        question: "How do solar panels work?",
        answer: "Solar panels convert sunlight into electrical energy.",
      },
    ];

    for (const faqData of faqs) {
      const faqExists = await faqRepository.findOne({
        where: { question: faqData.question },
      });

      if (!faqExists) {
        const faq = faqRepository.create(faqData);
        await faqRepository.save(faq);
      }
    }

    console.log("FAQ seeder completed.");
  }
}
