import config from "../constants/config";
import { DataSource, DataSourceOptions } from "typeorm";
import { SeederOptions } from "typeorm-extension";
import path from "path";
import { Category } from "../database/entities/category";
import { Product } from "../database/entities/product";
import { Brand } from "../database/entities/brand";
import { Cart } from "../database/entities/cart";
import { CartItem } from "../database/entities/cart-item";
import { Customer } from "../database/entities/customer";
import { Order } from "../database/entities/order";
import { OrderItem } from "../database/entities/order-item";
import { Payment } from "../database/entities/payment";
import { PaymentIntent } from "../database/entities/payment-intent";
import { User } from "../database/entities/user";
import { Coupon } from "../database/entities/coupon";
import { Notification } from "../database/entities/notification";
import { Project } from "../database/entities/projects";
import { Gallery } from "../database/entities/gallery";
import { Distributor } from "../database/entities/distributor";

const options: DataSourceOptions & SeederOptions = {
  type: config.db.type,
  host: config.db.host,
  port: config.db.port,
  username: config.db.user,
  password: config.db.password,
  database: config.db.name,
  synchronize: true,
  logging: false,
  extra: {
    connectionLimit: 10,
  },
  entities: [
    Category,
    Product,
    Brand,
    Cart,
    CartItem,
    Customer,
    Project,
    Distributor,
    Gallery,
    Order,
    OrderItem,
    Payment,
    PaymentIntent,
    User,
    Coupon,
    Notification,
  ],
  seeds: ["src/database/seeders/**/*{.ts,.js}"],
  factories: ["src/database/factories/**/*{.ts,.js}"],
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
};

export const AppDataSource = new DataSource(options);
