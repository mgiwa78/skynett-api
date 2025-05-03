import { User } from "../entities/user";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const adminRepository = dataSource.getRepository(User);

    const admin = [
      { name: "John Doe", email: "admin@mail.com", password: "Password" },
      { name: "Jane Smith", email: "jane@example.com", password: "Password" },
    ];

    for (const adminData of admin) {
      const adminExists = await adminRepository.findOne({
        where: { email: adminData.email },
      });

      if (!adminExists) {
        const admin = adminRepository.create(adminData);
        await admin.hashPassword();
        await adminRepository.save(admin);
      }
    }

    console.log("User seeder completed.");
  }
}
