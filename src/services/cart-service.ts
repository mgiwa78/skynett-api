import { Cart } from "@entities/cart";
import { CartRepository } from "@repositories/cart-repository";

export class CartService {
  private cartRepository: CartRepository;

  constructor() {
    this.cartRepository = new CartRepository();
  }

  async createCart(data: Partial<Cart>): Promise<Cart> {
    return await this.cartRepository.createEntity(data);
  }

  async getCartById(id: number): Promise<Cart | null> {
    return await this.cartRepository.findById(id);
  }

  async updateCart(id: number, data: Partial<Cart>): Promise<Cart | null> {
    return await this.cartRepository.updateEntity(id, data);
  }

  async deleteCart(id: number): Promise<boolean> {
    return await this.cartRepository.deleteEntity(id);
  }
}
