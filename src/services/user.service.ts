import { User } from "@entities/user";
import {
  PaginatedResult,
  PaginationOptions,
} from "@repositories/base.repository";
import { UserRepository } from "@repositories/user.repository";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async createUser(userData: Partial<User>): Promise<User> {
    return await this.userRepository.createEntity(userData);
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.userRepository.findById(id);
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
    return await this.userRepository.updateEntity(id, userData);
  }

  async deleteUser(id: string): Promise<boolean> {
    return await this.userRepository.deleteEntity(id);
  }

  async getAllUsers(
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<User>> {
    return await this.userRepository.findAll(options);
  }
}
