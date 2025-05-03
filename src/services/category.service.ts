import { Category } from "@entities/category";
import {
  PaginatedResult,
  PaginationOptions,
} from "@repositories/base.repository";
import { CategoryRepository } from "@repositories/category.repository";

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  async createCategory(data: Partial<Category>): Promise<Category> {
    return this.categoryRepository.createEntity(data);
  }

  async getCategoryById(id: string): Promise<Category | null> {
    return this.categoryRepository.findById(id);
  }

  async getAllCategories(
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<Category>> {
    return await this.categoryRepository.findAll(options);
  }

  async updateCategory(
    id: string,
    data: Partial<Category>
  ): Promise<Category | null> {
    return this.categoryRepository.updateEntity(id, data);
  }

  async deleteCategory(id: string): Promise<boolean> {
    return this.categoryRepository.deleteEntity(id);
  }
}
