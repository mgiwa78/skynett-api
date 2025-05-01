import { DataSource } from "typeorm";
import { BaseRepository } from "@repositories/base-repository";
import { Distributor } from "@entities/distributor";
import { AppDataSource } from "@config/ormconfig";

export class DistributorRepository extends BaseRepository<Distributor> {
  constructor() {
    super(AppDataSource, Distributor);
  }
}
