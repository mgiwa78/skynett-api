import { Router } from "express";
import { PaymentIntentController } from "../controllers/payment-intent.controller";

const router = Router();
const paymentIntentController = new PaymentIntentController();

router.post(
  "/initialize",
  paymentIntentController.initializePayment.bind(paymentIntentController)
);
router.get(
  "/verify",
  paymentIntentController.verifyPayment.bind(paymentIntentController)
);

export default router;
