import { FAQ } from "@entities/faq";
import { PaginatedResult } from "@repositories/base.repository";
import { FAQRepository } from "@repositories/faq.repository";

export class FAQService {
  private faqRepository: FAQRepository;

  constructor() {
    this.faqRepository = new FAQRepository();
  }

  async createFAQ(data: Partial<FAQ>): Promise<FAQ> {
    return this.faqRepository.createEntity(data);
  }

  async getFAQById(id: string): Promise<FAQ | null> {
    return this.faqRepository.findById(id);
  }

  async getAllFAQs(): Promise<PaginatedResult<FAQ>> {
    return this.faqRepository.findAll();
  }

  async updateFAQ(id: string, data: Partial<FAQ>): Promise<FAQ | null> {
    return this.faqRepository.updateEntity(id, data);
  }

  async deleteFAQ(id: string): Promise<boolean> {
    return this.faqRepository.deleteEntity(id);
  }
}
