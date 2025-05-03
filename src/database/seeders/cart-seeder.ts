import { DataSource } from "typeorm";
import { Cart } from "../entities/cart";
import { CartItem } from "../entities/cart-item";
import { Product } from "../entities/product";
import { Customer } from "../entities/customer";
import { Seeder } from "typeorm-extension";

export default class CartSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const cartRepository = dataSource.getRepository(Cart);
    const cartItemRepository = dataSource.getRepository(CartItem);
    const productRepository = dataSource.getRepository(Product);
    const customerRepository = dataSource.getRepository(Customer);

    // Get existing products and customers
    const products = await productRepository.find();
    const customers = await customerRepository.find();

    if (products.length === 0 || customers.length === 0) {
      console.log(
        "No products or customers found. Please run product and customer seeders first."
      );
      return;
    }

    // Create sample carts
    const sampleCarts = [
      {
        customer: customers[0],
        items: [
          { product: products[0], quantity: 2 },
          { product: products[1], quantity: 1 },
        ],
      },
      {
        customer: customers[1],
        items: [
          { product: products[2], quantity: 3 },
          { product: products[3], quantity: 1 },
        ],
      },
    ];

    for (const cartData of sampleCarts) {
      // Create cart
      const cart = new Cart();
      cart.customer = cartData.customer;
      await cartRepository.save(cart);

      // Create cart items
      for (const itemData of cartData.items) {
        const cartItem = new CartItem();
        cartItem.cart = cart;
        cartItem.product = itemData.product;
        cartItem.quantity = itemData.quantity;
        await cartItemRepository.save(cartItem);
      }
    }

    console.log("Cart seeder completed successfully");
  }
}
