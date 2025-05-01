import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import { faker } from "@faker-js/faker";
import { User } from "../entities/user";
import { Notification } from "../entities/notification";

export default class NotificationSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const notificationRepo = dataSource.getRepository(Notification);
    const userRepo = dataSource.getRepository(User);
    const users = await userRepo.find();
    if (users.length === 0) return;

    for (let i = 0; i < 40; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const notification = notificationRepo.create({
        title: faker.lorem.words(3),
        message: faker.lorem.sentences(2),
        user: randomUser,
        isRead: faker.datatype.boolean(),
      });
      await notificationRepo.save(notification);
    }
    console.log("Notification seeder completed.");
  }
}
