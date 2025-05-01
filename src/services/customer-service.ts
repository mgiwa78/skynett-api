import { Customer } from "@entities/customer";
import { PaginatedResult } from "@repositories/base-repository";
import { CustomerRepository } from "@repositories/customer-repository";

export class CustomerService {
  private customerRepository: CustomerRepository;

  constructor() {
    this.customerRepository = new CustomerRepository();
  }

  async createCustomer(data: Partial<Customer>): Promise<Customer> {
    return this.customerRepository.createEntity(data);
  }

  async getCustomerById(id: number): Promise<Customer | null> {
    return this.customerRepository.findById(id);
  }

  async getAllCustomers(): Promise<PaginatedResult<Customer>> {
    return this.customerRepository.findAll();
  }

  async updateCustomer(
    id: number,
    data: Partial<Customer>
  ): Promise<Customer | null> {
    return this.customerRepository.updateEntity(id, data);
  }

  async deleteCustomer(id: number): Promise<boolean> {
    return this.customerRepository.deleteEntity(id);
  }
}
