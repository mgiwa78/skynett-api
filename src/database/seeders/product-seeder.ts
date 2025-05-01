import { Product } from "../entities/product";
import { Category } from "../entities/category";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

export default class ProductSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const productRepository = dataSource.getRepository(Product);
    const categoryRepository = dataSource.getRepository(Category);

    const categories = await categoryRepository.find();
    if (categories.length === 0) {
      console.log("No categories found. Skipping product seeder.");
      return;
    }

    const products = [
      {
        name: "Solar Panel",
        description: "High-efficiency solar panel",
        price: 200,
      },
      {
        name: "Wind Turbine",
        description: "Durable and powerful wind turbine",
        price: 500,
      },
      { name: "Inverter", description: "Converts DC to AC power", price: 150 },
      {
        name: "Battery Pack",
        description: "Long-lasting battery storage",
        price: 300,
      },
      {
        name: "Charge Controller",
        description: "Regulates the battery charging",
        price: 100,
      },
    ];

    for (const productData of products) {
      const randomCategory =
        categories[Math.floor(Math.random() * categories.length)];
      const productExists = await productRepository.findOne({
        where: { name: productData.name },
      });

      if (!productExists) {
        const product = productRepository.create({
          ...productData,
          category: randomCategory,
          isVisible: true,
          imageUrl: "https://via.placeholder.com/150",
        });
        await productRepository.save(product);
      }
    }

    console.log("Product seeder completed.");
  }
}
