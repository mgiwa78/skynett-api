import { PaymentService } from "../services/payment.service";
import { Request, Response } from "express";
import { CartService } from "@services/cart.service";
import { CustomRequest } from "@middleware/require-auth";
import { AppDataSource } from "@config/ormconfig";
import { Order } from "@entities/order";
export class PaymentController {
  private paymentService: PaymentService;
  private cartService: CartService;

  constructor() {
    this.paymentService = new PaymentService();
    this.cartService = new CartService();
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
      const payment = await this.paymentService.getPaymentById(req.params.id);
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
        req.params.id,
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
      const result = await this.paymentService.deletePayment(req.params.id);
      if (!result)
        return res.status(404).json({ message: "Payment not found" });

      return res.status(200).json({ message: "Payment deleted successfully" });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to delete payment", error: err.message });
    }
  };

  initializePayment = async (
    req: CustomRequest,
    res: Response
  ): Promise<Response> => {
    try {
      const { email, cartId, orderId } = req.body;

      const orderRepo = AppDataSource.getRepository(Order);
      const order = await orderRepo.findOne({
        where: { id: orderId },
      });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      if (!cartId) {
        return res.status(400).json({ message: "Cart ID is required" });
      }

      let amount = 0;
      const cart = await this.cartService.getCartById(cartId);

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      amount = cart.items.reduce((total, item) => {
        return total + item.product.price * item.quantity;
      }, 0);

      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      const paymentIntent = await this.paymentService.initializePayment(
        amount,
        email,
        cartId,
        order.orderRef,
        {
          userId: req.user?.id,
          userEmail: req.user?.email,
        }
      );

      console.log(paymentIntent.paymentDetails);

      return res.status(200).json({
        message: "Payment initialized successfully",
        reference: paymentIntent.reference,
        authorizationUrl: paymentIntent.paymentDetails.authorization_url,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "Failed to initialize payment",
        error: error.message,
      });
    }
  };

  verifyPayment = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { reference } = req.params;

      if (!reference) {
        return res
          .status(400)
          .json({ message: "Payment reference is required" });
      }

      const paymentIntent = await this.paymentService.verifyPayment(reference);

      return res.status(200).json({
        message: "Payment verified successfully",
        data: paymentIntent,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "Failed to verify payment",
        error: error.message,
      });
    }
  };

  getPaymentStatus = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { reference } = req.params;

      if (!reference) {
        return res
          .status(400)
          .json({ message: "Payment reference is required" });
      }

      const paymentIntent = await this.paymentService.getPaymentStatus(
        reference
      );

      return res.status(200).json({
        message: "Payment status retrieved successfully",
        data: paymentIntent,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "Failed to get payment status",
        error: error.message,
      });
    }
  };
}
