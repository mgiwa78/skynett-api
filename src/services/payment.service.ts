import { Payment } from "../database/entities/payment";
import { PaginatedResult } from "../repositories/base.repository";
import { PaymentRepository } from "../repositories/payment.repository";
import axios from "axios";
import { PaymentIntent } from "../database/entities/payment-intent";
import { PaymentIntentRepository } from "../repositories/payment-intent.repository";
import { Cart } from "@entities/cart";
import { Order } from "@entities/order";
import { AppDataSource } from "@config/ormconfig";
import dotenv from "dotenv";
import { generatePaymentRef } from "@utils/helpers";
import { sendDynamicMail } from "../emails/mail.service";
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
    orderRef?: string,
    metadata: Record<string, any> = {}
  ): Promise<PaymentIntent> {
    const paymentIntentRepo = AppDataSource.getRepository(PaymentIntent);
    const cartRepo = AppDataSource.getRepository(Cart);
    const orderRepo = AppDataSource.getRepository(Order);

    const reference = generatePaymentRef().toUpperCase();

    try {
      const response = await axios.post(
        `${this.baseUrl}/transaction/initialize`,
        {
          amount: amount * 100,
          email,
          reference,
          metadata: {
            ...metadata,
            cartId,
            orderRef,
          },
          callback_url: `${process.env.CLIENT_APP_URL}/payment/verify/${reference}`,
        },
        {
          headers: this.getPaystackHeaders(),
        }
      );

      const paymentIntent = paymentIntentRepo.create({
        amount,
        currency: "NGN",
        reference,
        status: "pending",
        email,
        paymentDetails: response.data.data,
      });

      if (cartId) {
        const cart = await cartRepo.findOne({ where: { id: cartId } });
        if (cart) {
          paymentIntent.cart = cart;
        }
      }

      if (orderRef) {
        const order = await orderRepo.findOne({ where: { orderRef } });
        if (order) {
          paymentIntent.order = order;
        }
      }

      await paymentIntentRepo.save(paymentIntent);

      // Send payment initialization email
      await sendDynamicMail(email, `Payment Initialization - ${reference}`, [
        {
          type: "text",
          title: "Payment Reference",
          content: reference,
        },
        {
          type: "text",
          title: "Amount",
          content: String(amount),
        },
        {
          type: "text",
          title: "Authorization URL",
          content: paymentIntent.paymentDetails.authorization_url,
        },
      ]);

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

      paymentIntent.status = response.data.data.status;
      paymentIntent.paymentDate = paid_at ? new Date(paid_at) : undefined;
      paymentIntent.paymentMethod = authorization?.channel || undefined;

      paymentIntent.paymentDetails = response.data.data;
      await paymentIntentRepo.save(paymentIntent);

      if (status === "success" && paymentIntent.order) {
        const orderRepo = AppDataSource.getRepository(Order);
        paymentIntent.order.status = "paid";
        paymentIntent.order.paymentDetails = response.data.data;
        await orderRepo.save(paymentIntent.order);
      }

      if (paymentIntent.email && paymentIntent.order) {
        await sendDynamicMail(
          paymentIntent.email,
          `Payment Verification - ${reference}`,
          [
            {
              type: "text",
              title: "Payment Reference",
              content: reference,
            },
            {
              type: "text",
              title: "Status",
              content: status,
            },
            {
              type: "text",
              title: "Amount",
              content: String(paymentIntent.amount),
            },
            {
              type: "text",
              title: "Payment Date",
              content: paid_at ? new Date(paid_at).toLocaleString() : "N/A",
            },
          ]
        );
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
