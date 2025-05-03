import { OrderController } from "@controllers/order.controller";
import { Router } from "express";

const orderRouter = Router();
const orderController = new OrderController();

orderRouter.post("/", orderController.createOrder);
orderRouter.get("/", orderController.getAllOrders);
orderRouter.get("/:id", orderController.getOrderById);

export default orderRouter;
