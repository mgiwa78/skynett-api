import { DataSource } from "typeorm";
import { BaseRepository } from "@repositories/base.repository";
import { AppDataSource } from "@config/ormconfig";
import { Customer } from "@entities/customer";

export class CustomerRepository extends BaseRepository<Customer> {
  constructor() {
    super(AppDataSource, Customer);
  }

  protected getSearchableColumns(): string[] {
    return ["name", "email", "phone", "address"];
  }
}
