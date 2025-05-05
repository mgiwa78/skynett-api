import { ProductRepository } from "@repositories/product-repository";
import { Order } from "../database/entities/order";
import { PaginatedResult } from "../repositories/base.repository";
import { OrderRepository } from "../repositories/orders.repository";
import { In } from "typeorm";
import { generateOrderRef } from "@utils/helpers";
import { sendDynamicMail } from "../emails/mail.service";

export class OrderService {
  private orderRepository: OrderRepository;
  private productRepository: ProductRepository;

  constructor() {
    this.orderRepository = new OrderRepository();
    this.productRepository = new ProductRepository();
  }

  async createOrder(data: Partial<Order>): Promise<Order> {
    const products = await this.productRepository.find({
      where: {
        id: In(data.items.map((item) => item.product.id)),
      },
    });

    const totalAmount = products.reduce((acc, product) => {
      const item = data.items.find((item) => item.product.id === product.id);
      return acc + product.price * item.quantity;
    }, 0);

    const order = await this.orderRepository.createEntity({
      ...data,
      orderRef: generateOrderRef(),
      items: data.items.map((item) => ({
        ...item,
        product: products.find((p) => p.id === item.product.id),
      })),
      totalAmount,
    });

    console.log(order);

    if (order.shippingAddress.email) {
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
            headers: ["Product", "Quantity", "Price"],
            rows: order.items.map((item) => [
              item.product?.name || "Product",
              String(item.quantity),
              String(item.product?.price || ""),
            ]),
          },
          {
            type: "text",
            title: "Total Amount",
            content: String(order.totalAmount),
          },
        ]
      );
    }

    return order;
  }

  async getOrderById(id: string): Promise<Order | null> {
    return this.orderRepository.findById(id);
  }

  async getAllOrders(): Promise<PaginatedResult<Order>> {
    return this.orderRepository.findAll();
  }

  async updateOrder(id: string, data: Partial<Order>): Promise<Order | null> {
    return this.orderRepository.updateEntity(id, data);
  }

  async deleteOrder(id: string): Promise<boolean> {
    return this.orderRepository.deleteEntity(id);
  }
}
