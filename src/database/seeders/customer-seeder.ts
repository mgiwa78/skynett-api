import { Customer } from "../entities/customer";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

export default class CustomerSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const customerRepository = dataSource.getRepository(Customer);

    const customers = [
      { name: "John Doe", email: "john@example.com", phone: "1234567890" },
      { name: "Jane Smith", email: "jane@example.com", phone: "9876543210" },
    ];

    for (const customerData of customers) {
      const customerExists = await customerRepository.findOne({
        where: { email: customerData.email },
      });

      if (!customerExists) {
        const customer = customerRepository.create(customerData);
        await customerRepository.save(customer);
      }
    }

    console.log("Customer seeder completed.");
  }
}
