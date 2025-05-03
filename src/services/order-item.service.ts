import { OrderItem } from "@entities/order-item";
import { PaginatedResult } from "@repositories/base.repository";
import { OrderItemRepository } from "@repositories/order-item.repository";

export class OrderItemService {
  private orderItemRepository: OrderItemRepository;

  constructor() {
    this.orderItemRepository = new OrderItemRepository();
  }

  async createOrderItem(data: Partial<OrderItem>): Promise<OrderItem> {
    return this.orderItemRepository.createEntity(data);
  }

  async getOrderItemById(id: number): Promise<OrderItem | null> {
    return this.orderItemRepository.findById(id);
  }

  async getAllOrderItems(): Promise<PaginatedResult<OrderItem>> {
    return this.orderItemRepository.findAll();
  }

  async updateOrderItem(
    id: number,
    data: Partial<OrderItem>
  ): Promise<OrderItem | null> {
    return this.orderItemRepository.updateEntity(id, data);
  }

  async deleteOrderItem(id: number): Promise<boolean> {
    return this.orderItemRepository.deleteEntity(id);
  }
}
