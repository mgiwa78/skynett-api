import { Brand } from "../entities/brand";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

export default class BrandSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const brandRepository = dataSource.getRepository(Brand);

    const brands = [
      {
        name: "SolarTech",
        description: "Leading manufacturer of solar energy solutions",
        logoUrl: "https://via.placeholder.com/150?text=SolarTech",
      },
      {
        name: "WindPower",
        description: "Innovative wind energy technology provider",
        logoUrl: "https://via.placeholder.com/150?text=WindPower",
      },
      {
        name: "PowerGrid",
        description: "Advanced power management systems",
        logoUrl: "https://via.placeholder.com/150?text=PowerGrid",
      },
      {
        name: "EcoEnergy",
        description: "Sustainable energy solutions for a greener future",
        logoUrl: "https://via.placeholder.com/150?text=EcoEnergy",
      },
      {
        name: "GreenTech",
        description: "Environmentally friendly technology solutions",
        logoUrl: "https://via.placeholder.com/150?text=GreenTech",
      },
    ];

    for (const brandData of brands) {
      const brandExists = await brandRepository.findOne({
        where: { name: brandData.name },
      });

      if (!brandExists) {
        const brand = brandRepository.create(brandData);
        await brandRepository.save(brand);
      }
    }

    console.log("Brand seeder completed.");
  }
}
