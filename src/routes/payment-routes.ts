import { PaymentController } from "@controllers/payment-controller";
import { Router } from "express";

const paymentRouter = Router();
const paymentController = new PaymentController();

paymentRouter.post("/", paymentController.createPayment);
paymentRouter.get("/", paymentController.getAllPayments);
paymentRouter.get("/:id", paymentController.getPaymentById);
paymentRouter.put("/:id", paymentController.updatePayment);
paymentRouter.delete("/:id", paymentController.deletePayment);

export default paymentRouter;
