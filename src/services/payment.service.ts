import { Payment } from "../database/entities/payment";
import { PaginatedResult } from "../repositories/base.repository";
import { PaymentRepository } from "../repositories/payment.repository";
import axios from "axios";
import { PaymentIntent } from "../database/entities/payment-intent";
import { PaymentIntentRepository } from "../repositories/payment-intent.repository";
import { Cart } from "@entities/cart";
import { Order } from "@entities/order";
import { AppDataSource } from "@config/ormconfig";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

export class PaymentService {
  private paymentRepository: PaymentRepository;
  private readonly paystackSecretKey: string;
  private readonly paymentIntentRepository: PaymentIntentRepository;
  private readonly baseUrl: string = "https://api.paystack.co";

  constructor() {
    this.paymentRepository = new PaymentRepository();
    this.paystackSecretKey = process.env.PAYSTACK_SECRET_KEY || "";
    this.paymentIntentRepository = new PaymentIntentRepository();
    if (!this.paystackSecretKey) {
      throw new Error("PAYSTACK_SECRET_KEY is not set");
    }
  }

  private getPaystackHeaders() {
    return {
      Authorization: `Bearer ${this.paystackSecretKey}`,
      "Content-Type": "application/json",
    };
  }

  async createPayment(data: Partial<Payment>): Promise<Payment> {
    return this.paymentRepository.createEntity(data);
  }

  async getPaymentById(id: string): Promise<Payment | null> {
    return this.paymentRepository.findById(id);
  }

  async getAllPayments(): Promise<PaginatedResult<Payment>> {
    return this.paymentRepository.findAll();
  }

  async updatePayment(
    id: string,
    data: Partial<Payment>
  ): Promise<Payment | null> {
    return this.paymentRepository.updateEntity(id, data);
  }

  async deletePayment(id: string): Promise<boolean> {
    return this.paymentRepository.deleteEntity(id);
  }

  async initializePayment(
    amount: number,
    email: string,
    cartId?: string,
    orderId?: string,
    metadata: Record<string, any> = {}
  ): Promise<PaymentIntent> {
    const paymentIntentRepo = AppDataSource.getRepository(PaymentIntent);
    const cartRepo = AppDataSource.getRepository(Cart);
    const orderRepo = AppDataSource.getRepository(Order);

    // Create payment reference
    const reference = `PAY-${uuidv4()}`;

    // Initialize payment with Paystack
    try {
      const response = await axios.post(
        `${this.baseUrl}/transaction/initialize`,
        {
          amount: amount * 100, // Convert to kobo/cents
          email,
          reference,
          metadata: {
            ...metadata,
            cartId,
            orderId,
          },
          callback_url: `${process.env.CLIENT_APP_URL}/payment/verify/${reference}`,
        },
        {
          headers: this.getPaystackHeaders(),
        }
      );

      // Create payment intent
      const paymentIntent = paymentIntentRepo.create({
        amount,
        currency: "NGN",
        reference,
        status: "pending",
        email,
        metadata: {
          ...metadata,
          cartId,
          orderId,
          authorizationUrl: response.data.data.authorization_url,
        },
        callbackUrl: response.data.data.callback_url,
      });

      // Link cart or order if provided
      if (cartId) {
        const cart = await cartRepo.findOne({ where: { id: cartId } });
        if (cart) {
          paymentIntent.cart = cart;
        }
      }

      if (orderId) {
        const order = await orderRepo.findOne({ where: { id: orderId } });
        if (order) {
          paymentIntent.order = order;
        }
      }

      await paymentIntentRepo.save(paymentIntent);
      return paymentIntent;
    } catch (error: any) {
      throw new Error(`Failed to initialize payment: ${error.message}`);
    }
  }

  async verifyPayment(reference: string): Promise<PaymentIntent> {
    const paymentIntentRepo = AppDataSource.getRepository(PaymentIntent);
    const paymentIntent = await paymentIntentRepo.findOne({
      where: { reference },
      relations: ["cart", "order"],
    });

    if (!paymentIntent) {
      throw new Error("Payment intent not found");
    }

    try {
      const response = await axios.get(
        `${this.baseUrl}/transaction/verify/${reference}`,
        {
          headers: this.getPaystackHeaders(),
        }
      );

      const { status, paid_at, authorization } = response.data.data;

      // Update payment intent
      paymentIntent.status = status;
      paymentIntent.paymentDate = paid_at ? new Date(paid_at) : undefined;
      paymentIntent.paymentMethod = authorization?.channel || undefined;
      paymentIntent.metadata = {
        ...paymentIntent.metadata,
        paystackResponse: response.data.data,
      };

      await paymentIntentRepo.save(paymentIntent);

      // If payment is successful and there's an order, update order status
      if (status === "success" && paymentIntent.order) {
        const orderRepo = AppDataSource.getRepository(Order);
        paymentIntent.order.status = "paid";
        await orderRepo.save(paymentIntent.order);
      }

      return paymentIntent;
    } catch (error: any) {
      throw new Error(`Failed to verify payment: ${error.message}`);
    }
  }

  async getPaymentStatus(reference: string): Promise<PaymentIntent> {
    const paymentIntentRepo = AppDataSource.getRepository(PaymentIntent);
    const paymentIntent = await paymentIntentRepo.findOne({
      where: { reference },
      relations: ["cart", "order"],
    });

    if (!paymentIntent) {
      throw new Error("Payment intent not found");
    }

    return paymentIntent;
  }
}
