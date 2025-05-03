import { CustomRequest } from "@middleware/require-auth";
import { CartService } from "@services/cart.service";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

export class CartController {
  private cartService: CartService;

  constructor() {
    this.cartService = new CartService();
  }

  private getCartIdentifier(
    req: CustomRequest,
    res: Response
  ): {
    customerId?: string;
    sessionId?: string;
  } {
    if (req.user?.id) {
      return { customerId: req.user.id };
    }

    // Get or create session ID
    let sessionId = req.cookies?.cartSessionId;

    if (!sessionId) {
      sessionId = uuidv4();
      res.cookie("cartSessionId", sessionId, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
    }

    return { sessionId };
  }

  getCart = async (req: CustomRequest, res: Response): Promise<Response> => {
    try {
      const identifier = this.getCartIdentifier(req, res);
      const cart = await this.cartService.getCart(identifier);
      return res.status(200).json(cart);
    } catch (err: any) {
      return res
        .status(500)
        .json({ message: "Failed to fetch cart", error: err.message });
    }
  };

  addToCart = async (req: CustomRequest, res: Response): Promise<Response> => {
    try {
      const identifier = this.getCartIdentifier(req, res);

      const { productId, quantity } = req.body;

      if (!productId || !quantity) {
        return res
          .status(400)
          .json({ message: "Product ID and quantity are required" });
      }

      const cart = await this.cartService.addToCart(
        identifier,
        productId,
        quantity
      );
      return res.status(200).json(cart);
    } catch (err: any) {
      if (err.message === "Product not found") {
        return res.status(404).json({ message: err.message });
      }
      return res
        .status(500)
        .json({ message: "Failed to add item to cart", error: err.message });
    }
  };

  updateCartItem = async (
    req: CustomRequest,
    res: Response
  ): Promise<Response> => {
    try {
      const identifier = this.getCartIdentifier(req, res);
      const { itemId } = req.params;
      const { quantity } = req.body;

      if (!quantity) {
        return res.status(400).json({ message: "Quantity is required" });
      }

      const cart = await this.cartService.updateCartItem(
        identifier,
        itemId,
        quantity
      );
      return res.status(200).json(cart);
    } catch (err: any) {
      if (err.message === "Cart item not found") {
        return res.status(404).json({ message: err.message });
      }
      return res
        .status(500)
        .json({ message: "Failed to update cart item", error: err.message });
    }
  };

  removeFromCart = async (
    req: CustomRequest,
    res: Response
  ): Promise<Response> => {
    try {
      const identifier = this.getCartIdentifier(req, res);
      const { itemId } = req.params;

      const cart = await this.cartService.removeFromCart(identifier, itemId);
      return res.status(200).json(cart);
    } catch (err: any) {
      return res.status(500).json({
        message: "Failed to remove item from cart",
        error: err.message,
      });
    }
  };

  clearCart = async (req: CustomRequest, res: Response): Promise<Response> => {
    try {
      const identifier = this.getCartIdentifier(req, res);
      const cart = await this.cartService.clearCart(identifier);
      return res.status(200).json(cart);
    } catch (err: any) {
      return res
        .status(500)
        .json({ message: "Failed to clear cart", error: err.message });
    }
  };
}
