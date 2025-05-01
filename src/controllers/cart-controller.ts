import { CartService } from "@services/cart-service";
import { Request, Response } from "express";

export class CartController {
  private cartService: CartService;

  constructor() {
    this.cartService = new CartService();
  }

  createCart = async (req: Request, res: Response): Promise<Response> => {
    try {
      const cart = await this.cartService.createCart(req.body);
      return res.status(201).json(cart);
    } catch (err: any) {
      return res
        .status(500)
        .json({ message: "Failed to create cart", error: err.message });
    }
  };

  getCartById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const cart = await this.cartService.getCartById(+req.params.id);
      if (!cart) return res.status(404).json({ message: "Cart not found" });
      return res.status(200).json(cart);
    } catch (err: any) {
      return res
        .status(500)
        .json({ message: "Failed to fetch cart", error: err.message });
    }
  };

  updateCart = async (req: Request, res: Response): Promise<Response> => {
    try {
      const updatedCart = await this.cartService.updateCart(
        +req.params.id,
        req.body
      );
      if (!updatedCart)
        return res.status(404).json({ message: "Cart not found" });
      return res.status(200).json(updatedCart);
    } catch (err: any) {
      return res
        .status(500)
        .json({ message: "Failed to update cart", error: err.message });
    }
  };

  deleteCart = async (req: Request, res: Response): Promise<Response> => {
    try {
      const deleted = await this.cartService.deleteCart(+req.params.id);
      if (!deleted) return res.status(404).json({ message: "Cart not found" });
      return res.status(200).json({ message: "Cart deleted successfully" });
    } catch (err: any) {
      return res
        .status(500)
        .json({ message: "Failed to delete cart", error: err.message });
    }
  };
}
