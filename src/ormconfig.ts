// ormconfig.ts
import { DataSource, DataSourceOptions } from "typeorm";
import { SeederOptions } from "typeorm-extension";
import config from "./constants/config";

// export const AppDataSource = new DataSource({
//   type: "mysql",
//   host: config.db.host,
//   port: config.db.port,
//   username: config.db.user,
//   password: config.db.password,
//   database: config.db.name,
//   entities: [User, Role, Permission],
//   synchronize: config.db.synchronize,
//   logging: config.db.logging,
//   extra: {
//     connectionLimit: 10,
//   },

//   seeds: ["src/database/seeds/**/*{.ts,.js}"],
//   factories: ["src/database/factories/**/*{.ts,.js}"],
// })

const options: DataSourceOptions & SeederOptions = {
  type: "mysql",
  host: config.db.host,
  port: config.db.port,
  username: config.db.user,
  password: config.db.password,
  database: config.db.name,
  synchronize: config.db.synchronize,
  logging: config.db.logging,
  extra: {
    connectionLimit: 10,
  },
  entities: [__dirname + "/database/entities/*.{ts,js}"],
  seeds: ["src/database/seeders/**/*{.ts,.js}"],
  factories: ["src/database/factories/**/*{.ts,.js}"],
};

export const AppDataSource = new DataSource(options);
