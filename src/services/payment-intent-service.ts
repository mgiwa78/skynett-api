import { PaymentIntent } from "@entities/payment-intent";
import { PaginatedResult } from "@repositories/base-repository";
import { PaymentIntentRepository } from "@repositories/payment-intent-repository";

export class PaymentIntentService {
  private paymentIntentRepository: PaymentIntentRepository;

  constructor() {
    this.paymentIntentRepository = new PaymentIntentRepository();
  }

  async createPaymentIntent(
    data: Partial<PaymentIntent>
  ): Promise<PaymentIntent> {
    return this.paymentIntentRepository.createEntity(data);
  }

  async getPaymentIntentById(id: number): Promise<PaymentIntent | null> {
    return this.paymentIntentRepository.findById(id);
  }

  async getAllPaymentIntents(): Promise<PaginatedResult<PaymentIntent>> {
    return this.paymentIntentRepository.findAll();
  }

  async updatePaymentIntent(
    id: number,
    data: Partial<PaymentIntent>
  ): Promise<PaymentIntent | null> {
    return this.paymentIntentRepository.updateEntity(id, data);
  }

  async deletePaymentIntent(id: number): Promise<boolean> {
    return this.paymentIntentRepository.deleteEntity(id);
  }
}
