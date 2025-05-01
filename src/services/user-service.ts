import { User } from "@entities/user";
import {
  PaginatedResult,
  PaginationOptions,
} from "@repositories/base-repository";
import { UserRepository } from "@repositories/user-repository";

export class UserService {
  private adminRepository: UserRepository;

  constructor() {
    this.adminRepository = new UserRepository();
  }

  async createUser(adminData: Partial<User>): Promise<User> {
    return await this.adminRepository.createEntity(adminData);
  }

  async getUserById(id: number): Promise<User | null> {
    return await this.adminRepository.findById(id);
  }

  async updateUser(id: number, adminData: Partial<User>): Promise<User | null> {
    return await this.adminRepository.updateEntity(id, adminData);
  }

  async deleteUser(id: number): Promise<boolean> {
    return await this.adminRepository.deleteEntity(id);
  }

  async getAllUsers(
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<User>> {
    return await this.adminRepository.findAll(options);
  }
}
