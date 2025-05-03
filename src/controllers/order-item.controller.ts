import { Request, Response } from "express";
import { OrderItemService } from "@services/order-item.service";

export class OrderItemController {
  private orderItemService: OrderItemService;

  constructor() {
    this.orderItemService = new OrderItemService();
  }

  createOrderItem = async (req: Request, res: Response): Promise<Response> => {
    try {
      const orderItem = await this.orderItemService.createOrderItem(req.body);
      return res.status(201).json(orderItem);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to create order item", error: err.message });
    }
  };

  getOrderItemById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const orderItem = await this.orderItemService.getOrderItemById(
        req.params.id
      );
      if (!orderItem)
        return res.status(404).json({ message: "Order item not found" });

      return res.status(200).json(orderItem);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to fetch order item", error: err.message });
    }
  };

  getAllOrderItems = async (req: Request, res: Response): Promise<Response> => {
    try {
      const orderItems = await this.orderItemService.getAllOrderItems();
      return res.status(200).json(orderItems);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to fetch order items", error: err.message });
    }
  };

  updateOrderItem = async (req: Request, res: Response): Promise<Response> => {
    try {
      const updatedOrderItem = await this.orderItemService.updateOrderItem(
        req.params.id,
        req.body
      );
      if (!updatedOrderItem)
        return res.status(404).json({ message: "Order item not found" });

      return res.status(200).json(updatedOrderItem);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to update order item", error: err.message });
    }
  };

  deleteOrderItem = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.orderItemService.deleteOrderItem(
        parseInt(req.params.id)
      );
      if (!result)
        return res.status(404).json({ message: "Order item not found" });

      return res
        .status(200)
        .json({ message: "Order item deleted successfully" });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to delete order item", error: err.message });
    }
  };
}
