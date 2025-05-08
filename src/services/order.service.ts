import { ProductRepository } from "@repositories/product-repository";
import { Order } from "../database/entities/order";
import {
  PaginatedResult,
  PaginationOptions,
} from "../repositories/base.repository";
import { OrderRepository } from "../repositories/orders.repository";
import { In } from "typeorm";
import { generateOrderRef } from "@utils/helpers";
import { sendDynamicMail } from "../emails/mail.service";
import { AppDataSource } from "@config/ormconfig";
import { OrderItem } from "@entities/order-item";
import { CartService } from "./cart.service";

export class OrderService {
  private orderRepository: OrderRepository;
  private productRepository: ProductRepository;
  private cartService: CartService;

  constructor() {
    this.orderRepository = new OrderRepository();
    this.productRepository = new ProductRepository();
    this.cartService = new CartService();
  }

  async createOrder(
    data: Partial<Order>,
    cartSessionId: string
  ): Promise<Order> {
    const cart = await this.cartService.getCart({ sessionId: cartSessionId });
    if (!cart || !cart.items.length) {
      throw new Error("Cart is empty");
    }

    const products = await this.productRepository.find({
      where: {
        id: In(cart.items.map((item) => item.product.id)),
      },
    });

    const totalAmount = cart.items.reduce((acc, item) => {
      const product = products.find((p) => p.id === item.product.id);
      return acc + (product?.price || 0) * item.quantity;
    }, 0);

    const order = await AppDataSource.transaction(
      async (transactionalEntityManager) => {
        const order = await transactionalEntityManager.save(Order, {
          ...data,
          orderRef: generateOrderRef(),
          totalAmount,
          status: "pending",
        });

        await Promise.all(
          cart.items.map(async (item) => {
            const product = products.find((p) => p.id === item.product.id);
            if (product) {
              return transactionalEntityManager.save(OrderItem, {
                product,
                quantity: item.quantity,
                price: product.price,
                order,
              });
            }
          })
        );

        await this.cartService.clearCart({ sessionId: cartSessionId });

        return order;
      }
    );

    // Send order confirmation email
    if (order.shippingAddress?.email) {
      await sendDynamicMail(
        order.shippingAddress.email,
        `Order Confirmation - ${order.orderRef}`,
        [
          {
            type: "text",
            title: "Order Reference",
            content: order.orderRef,
          },
          {
            type: "table",
            title: "Order Summary",
            headers: ["Product", "Quantity", "Price", "Subtotal"],
            rows: cart.items.map((item) => {
              const product = products.find((p) => p.id === item.product.id);
              const subtotal = (product?.price || 0) * item.quantity;
              return [
                product?.name || "Product",
                String(item.quantity),
                String(product?.price || 0),
                String(subtotal),
              ];
            }),
          },
          {
            type: "text",
            title: "Total Amount",
            content: String(order.totalAmount),
          },
          {
            type: "text",
            title: "Shipping Address",
            content: JSON.stringify(order.shippingAddress, null, 2),
          },
        ]
      );
    }

    return order;
  }

  async getOrderById(id: string): Promise<Order | null> {
    return this.orderRepository.findById(id);
  }

  async getAllOrders(
    options: PaginationOptions
  ): Promise<PaginatedResult<Order>> {
    const orders = await this.orderRepository.find({
      where: {
        ...options.filters,
      },
      relations: ["items", "items.product"],
      skip: (options.page - 1) * options.limit,
      take: options.limit,
    });

    const total = await this.orderRepository.count({
      where: {
        ...options.filters,
      },
    });

    return {
      data: orders,
      total: total,
      page: options.page,
      limit: options.limit,
      pages: Math.ceil(total / options.limit),
    };
  }

  async updateOrder(id: string, data: Partial<Order>): Promise<Order | null> {
    return this.orderRepository.updateEntity(id, data);
  }

  async deleteOrder(id: string): Promise<boolean> {
    return this.orderRepository.deleteEntity(id);
  }
}
