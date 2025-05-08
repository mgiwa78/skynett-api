import { Request, Response } from "express";
import { OrderService } from "../services/order.service";
import { CartService } from "@services/cart.service";

export class OrderController {
  private orderService: OrderService;
  private cartService: CartService;
  constructor() {
    this.orderService = new OrderService();
    this.cartService = new CartService();
  }

  createOrder = async (req: Request, res: Response): Promise<Response> => {
    try {
      const sessionId = req.cookies?.cartSessionId;
      if (!sessionId) {
        return res.status(400).json({ message: "Cart session ID is required" });
      }

      const { ...orderData } = req.body;

      const order = await this.orderService.createOrder(orderData, sessionId);
      await this.cartService.clearCart({ sessionId });
      return res.status(201).json(order);
    } catch (error: any) {
      if (error.message === "Cart is empty") {
        return res.status(400).json({ message: error.message });
      }
      return res
        .status(500)
        .json({ message: "Failed to create order", error: error.message });
    }
  };

  getOrderById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const order = await this.orderService.getOrderById(req.params.id);
      if (!order) return res.status(404).json({ message: "Order not found" });

      return res.status(200).json(order);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to fetch order", error: err.message });
    }
  };

  getAllOrders = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { page, limit, search, sort, filters } = req.query;
      const orders = await this.orderService.getAllOrders({
        page: Number(page),
        limit: Number(limit),
        search: String(search),
        sort: String(sort),
        filters,
      });
      return res.status(200).json(orders);
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Failed to fetch orders", error: err.message });
    }
  };

  updateOrder = async (req: Request, res: Response): Promise<Response> => {
    try {
      const updatedOrder = await this.orderService.updateOrder(
        req.params.id,
        req.body
      );
      if (!updatedOrder)
        return res.status(404).json({ message: "Order not found" });

      return res.status(200).json(updatedOrder);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to update order", error: err.message });
    }
  };

  deleteOrder = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.orderService.deleteOrder(req.params.id);
      if (!result) return res.status(404).json({ message: "Order not found" });

      return res.status(200).json({ message: "Order deleted successfully" });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to delete order", error: err.message });
    }
  };
}
