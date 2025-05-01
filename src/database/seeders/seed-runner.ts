import "reflect-metadata";
import { runSeeder } from "typeorm-extension";
import { AppDataSource } from "../../ormconfig";
import NotificationSeeder from "./notification-seeder";
import OrderSeeder from "./order-seeder";
import ProductCategorySeeder from "./product-category-seeder";
import ProductSeeder from "./product-seeder";
import CouponSeeder from "./coupon-seeder";
import OrderItemSeeder from "./order-item-seeder";
import ProjectSeeder from "./project-seeder";
import DistributorSeeder from "./distributor-seeder";
import GallerySeeder from "./gallery-seeder";
import PaymentSeeder from "./payment-seeder";
import PaymentIntentSeeder from "./payment-intent-seeder";
import CustomerSeeder from "./customer-seeder";
import UserSeeder from "./admin-seeder";

const runSeeders = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");

    await AppDataSource.dropDatabase();
    console.log("Database schema has been dropped.");

    await AppDataSource.synchronize();
    console.log("Database schema has been recreated.");

    await runSeeder(AppDataSource, ProductCategorySeeder);
    await runSeeder(AppDataSource, ProductSeeder);
    await runSeeder(AppDataSource, OrderSeeder);
    await runSeeder(AppDataSource, CustomerSeeder);
    await runSeeder(AppDataSource, CouponSeeder);
    await runSeeder(AppDataSource, UserSeeder);
    await runSeeder(AppDataSource, OrderItemSeeder);
    await runSeeder(AppDataSource, ProjectSeeder);
    await runSeeder(AppDataSource, DistributorSeeder);
    await runSeeder(AppDataSource, GallerySeeder);
    await runSeeder(AppDataSource, PaymentSeeder);
    await runSeeder(AppDataSource, PaymentIntentSeeder);

    console.log("Seeders have been run successfully!");
  } catch (err) {
    console.error("Error during Data Source initialization or seeding:", err);
  } finally {
    await AppDataSource.destroy();
    process.exit();
  }
};

runSeeders();
