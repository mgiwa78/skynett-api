import { Cart } from "@entities/cart";
import { CartRepository } from "@repositories/cart.repository";
import { ProductRepository } from "@repositories/product.repository";
import { CartItem } from "@entities/cart-item";
import { AppDataSource } from "@config/ormconfig";

interface CartIdentifier {
  customerId?: string;
  sessionId?: string;
}

export class CartService {
  private cartRepository: CartRepository;
  private productRepository: ProductRepository;

  constructor() {
    this.cartRepository = new CartRepository();
    this.productRepository = new ProductRepository();
  }

  async getOrCreateCart(identifier: CartIdentifier): Promise<Cart> {
    let cart: Cart | null = null;

    if (identifier.customerId) {
      cart = await this.cartRepository.findByCustomerId(identifier.customerId);
    } else if (identifier.sessionId) {
      cart = await this.cartRepository.findBySessionId(identifier.sessionId);
    }

    if (!cart) {
      cart = await this.cartRepository.createEntity({
        customer: identifier.customerId ? { id: identifier.customerId } : null,
        sessionId: identifier.sessionId || null,
        items: [],
      });
    }

    if (!cart.items) {
      cart.items = [];
      await this.cartRepository.updateEntity(cart.id, cart);
    }

    return cart;
  }

  async addToCart(
    identifier: CartIdentifier,
    productId: string,
    quantity: number
  ): Promise<Cart> {
    const cart = await this.getOrCreateCart(identifier);
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new Error("Product not found");
    }

    const cartItemRepository = AppDataSource.getRepository(CartItem);
    const existingItem = cart.items?.find(
      (item) => item.product.id === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      await cartItemRepository.save(existingItem);
    } else {
      const newItem = cartItemRepository.create({
        cart,
        product,
        quantity,
      });
      await cartItemRepository.save(newItem);
      cart.items = [...(cart.items || []), newItem];
    }

    return this.cartRepository.updateEntity(cart.id, cart);
  }

  async updateCartItem(
    identifier: CartIdentifier,
    itemId: string,
    quantity: number
  ): Promise<Cart> {
    const cart = await this.getOrCreateCart(identifier);
    const cartItemRepository = AppDataSource.getRepository(CartItem);
    const item = cart.items?.find((item) => item.id === itemId);

    if (!item) {
      throw new Error("Cart item not found");
    }

    if (quantity <= 0) {
      await cartItemRepository.remove(item);
      cart.items = cart.items?.filter((i) => i.id !== itemId);
    } else {
      item.quantity = quantity;
      await cartItemRepository.save(item);
    }

    return cart;
  }

  async removeFromCart(
    identifier: CartIdentifier,
    itemId: string
  ): Promise<Cart> {
    const cart = await this.getOrCreateCart(identifier);
    const cartItemRepository = AppDataSource.getRepository(CartItem);
    const item = cart.items?.find((i) => i.id === itemId);

    if (item) {
      await cartItemRepository.remove(item);
      cart.items = cart.items?.filter((i) => i.id !== itemId);
    }

    return cart;
  }

  async clearCart(identifier: CartIdentifier): Promise<Cart> {
    const cart = await this.getOrCreateCart(identifier);
    const cartItemRepository = AppDataSource.getRepository(CartItem);
    console.log("cart", cart);

    if (cart.items?.length) {
      await cartItemRepository.remove(cart.items);
      cart.items = [];
    }

    return cart;
  }

  async getCart(identifier: CartIdentifier): Promise<Cart> {
    return this.getOrCreateCart(identifier);
  }

  async getCartById(id: string): Promise<Cart | null> {
    return this.cartRepository.findById(id);
  }
}
