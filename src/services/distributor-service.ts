import { Distributor } from "@entities/distributor";
import { PaginatedResult } from "@repositories/base-repository";
import { DistributorRepository } from "@repositories/distributor-repository";

export class DistributorService {
  private distributorRepository: DistributorRepository;

  constructor() {
    this.distributorRepository = new DistributorRepository();
  }

  async createDistributor(data: Partial<Distributor>): Promise<Distributor> {
    return this.distributorRepository.createEntity(data);
  }

  async getDistributorById(id: number): Promise<Distributor | null> {
    return this.distributorRepository.findById(id);
  }

  async getAllDistributors(): Promise<PaginatedResult<Distributor>> {
    return this.distributorRepository.findAll();
  }

  async updateDistributor(
    id: number,
    data: Partial<Distributor>
  ): Promise<Distributor | null> {
    return this.distributorRepository.updateEntity(id, data);
  }

  async deleteDistributor(id: number): Promise<boolean> {
    return this.distributorRepository.deleteEntity(id);
  }
}
