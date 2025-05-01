import { Category } from "../entities/category";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

export default class CategorySeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const categoryRepository = dataSource.getRepository(Category);

    const categories = [
      { name: "Solar", description: "Solar energy products" },
      { name: "Wind", description: "Wind energy products" },
      { name: "Storage", description: "Energy storage and batteries" },
      {
        name: "Electrical",
        description: "Electrical components and inverters",
      },
    ];

    for (const categoryData of categories) {
      const categoryExists = await categoryRepository.findOne({
        where: { name: categoryData.name },
      });

      if (!categoryExists) {
        const category = categoryRepository.create(categoryData);
        await categoryRepository.save(category);
      }
    }

    console.log("Category seeder completed.");
  }
}
