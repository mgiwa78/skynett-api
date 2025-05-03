import { Router } from "express";
import { CartController } from "@controllers/cart.controller";

const router = Router();
const cartController = new CartController();

router.get("/", cartController.getCart);
router.post("/items", cartController.addToCart);
router.put("/items/:itemId", cartController.updateCartItem);
router.delete("/items/:itemId", cartController.removeFromCart);
router.delete("/", cartController.clearCart);

export default router;
