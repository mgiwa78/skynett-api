import { Request, Response } from "express";
import { PaymentIntentService } from "@services/payment-intent-service";

export class PaymentIntentController {
  private paymentIntentService: PaymentIntentService;

  constructor() {
    this.paymentIntentService = new PaymentIntentService();
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
      return res
        .status(500)
        .json({
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
        await this.paymentIntentService.getPaymentIntentById(
          parseInt(req.params.id)
        );
      if (!paymentIntent)
        return res.status(404).json({ message: "Payment intent not found" });

      return res.status(200).json(paymentIntent);
    } catch (err) {
      return res
        .status(500)
        .json({
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
      return res
        .status(500)
        .json({
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
          parseInt(req.params.id),
          req.body
        );
      if (!updatedPaymentIntent)
        return res.status(404).json({ message: "Payment intent not found" });

      return res.status(200).json(updatedPaymentIntent);
    } catch (err) {
      return res
        .status(500)
        .json({
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
      return res
        .status(500)
        .json({
          message: "Failed to delete payment intent",
          error: err.message,
        });
    }
  };
}
