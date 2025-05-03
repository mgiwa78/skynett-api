import { User } from "@entities/user";
import { BaseRepository } from "./base.repository";
import { AppDataSource } from "@config/ormconfig";

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super(AppDataSource, User);
  }

  protected getSearchableColumns(): string[] {
    return ["name", "email", "phone", "address"];
  }
}
