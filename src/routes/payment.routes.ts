import { Router } from "express";
import { PaymentController } from "@controllers/payment.controller";
import { verifyToken } from "@middleware/require-auth";

const router = Router();
const paymentController = new PaymentController();

router.post("/initialize", paymentController.initializePayment);
router.get("/verify/:reference", paymentController.verifyPayment);
router.get("/status/:reference", paymentController.getPaymentStatus);

export default router;
