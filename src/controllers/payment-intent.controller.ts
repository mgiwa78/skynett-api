import { Request, Response } from "express";
import { PaymentIntentService } from "@services/payment-intent.service";
import { PaymentService } from "../services/payment.service";

export class PaymentIntentController {
  private paymentIntentService: PaymentIntentService;
  private paymentService: PaymentService;

  constructor() {
    this.paymentIntentService = new PaymentIntentService();
    this.paymentService = new PaymentService();
  }

  createPaymentIntent = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const paymentIntent = await this.paymentIntentService.createPaymentIntent(
        req.body
      );
      return res.status(201).json(paymentIntent);
    } catch (err) {
      return res.status(500).json({
        message: "Failed to create payment intent",
        error: err.message,
      });
    }
  };

  getPaymentIntentById = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const paymentIntent =
        await this.paymentIntentService.getPaymentIntentById(req.params.id);
      if (!paymentIntent)
        return res.status(404).json({ message: "Payment intent not found" });

      return res.status(200).json(paymentIntent);
    } catch (err) {
      return res.status(500).json({
        message: "Failed to fetch payment intent",
        error: err.message,
      });
    }
  };

  getAllPaymentIntents = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const paymentIntents =
        await this.paymentIntentService.getAllPaymentIntents();
      return res.status(200).json(paymentIntents);
    } catch (err) {
      return res.status(500).json({
        message: "Failed to fetch payment intents",
        error: err.message,
      });
    }
  };

  updatePaymentIntent = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const updatedPaymentIntent =
        await this.paymentIntentService.updatePaymentIntent(
          req.params.id,
          req.body
        );
      if (!updatedPaymentIntent)
        return res.status(404).json({ message: "Payment intent not found" });

      return res.status(200).json(updatedPaymentIntent);
    } catch (err) {
      return res.status(500).json({
        message: "Failed to update payment intent",
        error: err.message,
      });
    }
  };

  deletePaymentIntent = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const result = await this.paymentIntentService.deletePaymentIntent(
        parseInt(req.params.id)
      );
      if (!result)
        return res.status(404).json({ message: "Payment intent not found" });

      return res
        .status(200)
        .json({ message: "Payment intent deleted successfully" });
    } catch (err) {
      return res.status(500).json({
        message: "Failed to delete payment intent",
        error: err.message,
      });
    }
  };

  async initializePayment(req: Request, res: Response) {
    try {
      const { amount, email, orderId } = req.body;

      if (!amount || !email || !orderId) {
        return res.status(400).json({
          message: "Amount, email, and orderId are required",
        });
      }

      const result = await this.paymentService.initializePayment(
        amount,
        email,
        orderId
      );

      return res.status(200).json(result);
    } catch (error) {
      console.error("Payment initialization failed:", error);
      return res.status(500).json({
        message: "Payment initialization failed",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async verifyPayment(req: Request, res: Response) {
    try {
      const { reference } = req.query;

      if (!reference) {
        return res.status(400).json({
          message: "Reference is required",
        });
      }

      const result = await this.paymentService.verifyPayment(
        reference as string
      );

      return res.status(200).json(result);
    } catch (error) {
      console.error("Payment verification failed:", error);
      return res.status(500).json({
        message: "Payment verification failed",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
