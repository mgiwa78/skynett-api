import { Product, ProductStatus } from "../entities/product";
import { Category } from "../entities/category";
import { Brand } from "../entities/brand";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import { generateProductCode } from "../../utils/helpers";

export default class ProductSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const productRepository = dataSource.getRepository(Product);
    const categoryRepository = dataSource.getRepository(Category);
    const brandRepository = dataSource.getRepository(Brand);

    const categories = await categoryRepository.find();
    const brands = await brandRepository.find();

    if (categories.length === 0 || brands.length === 0) {
      console.log("No categories or brands found. Skipping product seeder.");
      return;
    }

    const products = [
      {
        name: "Solar Panel",
        description: "High-efficiency solar panel",
        price: 200,
        discountedPrice: 180,
        brands: ["SolarTech", "EcoEnergy"],
      },
      {
        name: "Wind Turbine",
        description: "Durable and powerful wind turbine",
        price: 500,
        discountedPrice: 450,
        brands: ["WindPower", "GreenTech"],
      },
      {
        name: "Inverter",
        description: "Converts DC to AC power",
        price: 150,
        discountedPrice: 135,
        brands: ["PowerGrid", "SolarTech"],
      },
      {
        name: "Battery Pack",
        description: "Long-lasting battery storage",
        price: 300,
        discountedPrice: 270,
        brands: ["EcoEnergy", "PowerGrid"],
      },
      {
        name: "Charge Controller",
        description: "Regulates the battery charging",
        price: 100,
        discountedPrice: 90,
        brands: ["GreenTech", "SolarTech"],
      },
    ];

    for (const productData of products) {
      const randomCategory =
        categories[Math.floor(Math.random() * categories.length)];
      const productBrands = brands.filter((b) =>
        productData.brands.includes(b.name)
      );

      if (productBrands.length === 0) {
        console.log(
          `No matching brands found for product ${productData.name}. Skipping.`
        );
        continue;
      }

      const productExists = await productRepository.findOne({
        where: { name: productData.name },
      });

      if (!productExists) {
        const { brands: brandNames, ...productDataWithoutBrands } = productData;
        const product = productRepository.create({
          ...productDataWithoutBrands,
          categories: [randomCategory],
          brands: productBrands,
          productCode: generateProductCode(),
          stock: Math.floor(Math.random() * 100) + 1,
          status: ProductStatus.ACTIVE,
          image: "https://placehold.co/600x600",
        });
        await productRepository.save(product);
      }
    }

    console.log("Product seeder completed.");
  }
}
