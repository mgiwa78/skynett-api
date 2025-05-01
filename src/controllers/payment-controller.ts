import { PaymentService } from "@services/payment-service";
import { Request, Response } from "express";

export class PaymentController {
  private paymentService: PaymentService;

  constructor() {
    this.paymentService = new PaymentService();
  }

  createPayment = async (req: Request, res: Response): Promise<Response> => {
    try {
      const payment = await this.paymentService.createPayment(req.body);
      return res.status(201).json(payment);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to create payment", error: err.message });
    }
  };

  getPaymentById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const payment = await this.paymentService.getPaymentById(
        parseInt(req.params.id)
      );
      if (!payment)
        return res.status(404).json({ message: "Payment not found" });

      return res.status(200).json(payment);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to fetch payment", error: err.message });
    }
  };

  getAllPayments = async (req: Request, res: Response): Promise<Response> => {
    try {
      const payments = await this.paymentService.getAllPayments();
      return res.status(200).json(payments);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to fetch payments", error: err.message });
    }
  };

  updatePayment = async (req: Request, res: Response): Promise<Response> => {
    try {
      const updatedPayment = await this.paymentService.updatePayment(
        parseInt(req.params.id),
        req.body
      );
      if (!updatedPayment)
        return res.status(404).json({ message: "Payment not found" });

      return res.status(200).json(updatedPayment);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to update payment", error: err.message });
    }
  };

  deletePayment = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.paymentService.deletePayment(
        parseInt(req.params.id)
      );
      if (!result)
        return res.status(404).json({ message: "Payment not found" });

      return res.status(200).json({ message: "Payment deleted successfully" });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to delete payment", error: err.message });
    }
  };
}
