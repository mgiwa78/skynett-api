import { Distributor } from "../entities/distributor";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

export default class DistributorSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const distributorRepository = dataSource.getRepository(Distributor);

    const distributors = [
      {
        name: "Green Energy Distributors",
        email: "greenenergy@example.com",
        phone: "123-456-7890",
      },
      {
        name: "Solar Supply Co.",
        email: "solarsupply@example.com",
        phone: "987-654-3210",
      },
      {
        name: "Wind Power Solutions",
        email: "windpower@example.com",
        phone: "456-789-1234",
      },
    ];

    for (const distributorData of distributors) {
      const distributorExists = await distributorRepository.findOne({
        where: { email: distributorData.email },
      });

      if (!distributorExists) {
        const distributor = distributorRepository.create({
          ...distributorData,
          address: "Random Address " + Math.floor(Math.random() * 1000),
        });
        await distributorRepository.save(distributor);
      }
    }

    console.log("Distributor seeder completed.");
  }
}
