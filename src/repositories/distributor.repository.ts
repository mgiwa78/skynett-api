import { DataSource } from "typeorm";
import { BaseRepository } from "./base.repository";
import { Distributor } from "../database/entities/distributor";
import { AppDataSource } from "../config/ormconfig";

export class DistributorRepository extends BaseRepository<Distributor> {
  constructor() {
    super(AppDataSource, Distributor);
  }

  protected getSearchableColumns(): string[] {
    return ["name"];
  }
}
