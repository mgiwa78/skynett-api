import { Payment } from "@entities/payment";
import { PaginatedResult } from "@repositories/base-repository";
import { PaymentRepository } from "@repositories/payment-repository";

export class PaymentService {
  private paymentRepository: PaymentRepository;

  constructor() {
    this.paymentRepository = new PaymentRepository();
  }

  async createPayment(data: Partial<Payment>): Promise<Payment> {
    return this.paymentRepository.createEntity(data);
  }

  async getPaymentById(id: number): Promise<Payment | null> {
    return this.paymentRepository.findById(id);
  }

  async getAllPayments(): Promise<PaginatedResult<Payment>> {
    return this.paymentRepository.findAll();
  }

  async updatePayment(
    id: number,
    data: Partial<Payment>
  ): Promise<Payment | null> {
    return this.paymentRepository.updateEntity(id, data);
  }

  async deletePayment(id: number): Promise<boolean> {
    return this.paymentRepository.deleteEntity(id);
  }
}
