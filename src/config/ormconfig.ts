import config from "../constants/config";
import { DataSource, DataSourceOptions } from "typeorm";
import { SeederOptions } from "typeorm-extension";
import path from "path";

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
    path.join(__dirname, "../database/entities/**/*") +
      (process.env.NODE_ENV === "production" ? ".js" : ".ts"),
  ],
  seeds: ["src/database/seeders/**/*{.ts,.js}"],
  factories: ["src/database/factories/**/*{.ts,.js}"],
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
};

export const AppDataSource = new DataSource(options);
