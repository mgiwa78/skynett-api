import { Request, Response } from "express";
import { OrderService } from "../services/order.service";

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  createOrder = async (req: Request, res: Response): Promise<Response> => {
    const order = await this.orderService.createOrder(req.body);
    return res.status(201).json(order);
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
      const orders = await this.orderService.getAllOrders();
      return res.status(200).json(orders);
    } catch (err) {
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
