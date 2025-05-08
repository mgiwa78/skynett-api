import "reflect-metadata";
import { runSeeder } from "typeorm-extension";
import { AppDataSource } from "../../config/ormconfig";
import ProductCategorySeeder from "./product-category.seeder";
import BrandSeeder from "./brand.seeder";
import ProductSeeder from "./product.seeder";
import CustomerSeeder from "./customer.seeder";
import CartSeeder from "./cart-seeder";
import NotificationSeeder from "./notification.seeder";
import OrderSeeder from "./order.seeder";
import CouponSeeder from "./coupon.seeder";
import OrderItemSeeder from "./order-item.seeder";
import ProjectSeeder from "./project.seeder";
import DistributorSeeder from "./distributor.seeder";
import GallerySeeder from "./gallery.seeder";
import PaymentSeeder from "./payment.seeder";
import PaymentIntentSeeder from "./payment-intent.seeder";
import UserSeeder from "./admin.seeder";

const runSeeders = async () => {
  let dataSource: typeof AppDataSource | null = null;

  try {
    dataSource = await AppDataSource.initialize();
    console.log("Data Source has been initialized!");

    await dataSource.dropDatabase();
    console.log("Database schema has been dropped.");

    await dataSource.synchronize();
    console.log("Database schema has been recreated.");

    // await runSeeder(dataSource, ProductCategorySeeder);
    // await runSeeder(dataSource, BrandSeeder);
    // await runSeeder(dataSource, ProductSeeder);
    // await runSeeder(dataSource, CustomerSeeder);
    await runSeeder(dataSource, UserSeeder);
    // await runSeeder(dataSource, OrderSeeder);
    await runSeeder(dataSource, CouponSeeder);
    // await runSeeder(dataSource, OrderItemSeeder);
    await runSeeder(dataSource, ProjectSeeder);
    // await runSeeder(dataSource, DistributorSeeder);
    await runSeeder(dataSource, GallerySeeder);
    // await runSeeder(dataSource, PaymentSeeder);
    // await runSeeder(dataSource, PaymentIntentSeeder);
    // await runSeeder(dataSource, NotificationSeeder);
    // await runSeeder(dataSource, CartSeeder);

    console.log("Seeders have been run successfully!");
  } catch (err) {
    console.error("Error during Data Source initialization or seeding:", err);
    process.exit(1);
  } finally {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
    }
    process.exit(0);
  }
};

runSeeders();
