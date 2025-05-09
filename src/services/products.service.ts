import { Product } from "@entities/product";
import {
  PaginatedResult,
  PaginationOptions,
} from "@repositories/base.repository";
import { ProductRepository } from "@repositories/product.repository";
import { generateProductCode } from "@utils/helpers";
export class ProductService {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async createProduct(data: Partial<Product>): Promise<Product> {
    return this.productRepository.createEntity({
      ...data,
      productCode: generateProductCode(),
    });
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.productRepository.findById(id);
  }

  async getAllProducts(
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<Product>> {
    return this.productRepository.findAll(options);
  }

  async updateProduct(
    id: string,
    data: Partial<Product>
  ): Promise<Product | null> {
    return this.productRepository.updateEntity(id, data);
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.productRepository.deleteEntity(id);
  }
}
