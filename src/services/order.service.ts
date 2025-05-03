import { Order } from "../database/entities/order";
import { PaginatedResult } from "../repositories/base.repository";
import { OrderRepository } from "../repositories/orders.repository";

export class OrderService {
  private orderRepository: OrderRepository;

  constructor() {
    this.orderRepository = new OrderRepository();
  }

  async createOrder(data: Partial<Order>): Promise<Order> {
    return this.orderRepository.createEntity(data);
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
