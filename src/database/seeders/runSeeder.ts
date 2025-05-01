import { DataSource, DataSourceOptions } from "typeorm";
import { runSeeders, SeederOptions } from "typeorm-extension";

(async () => {
  const options: DataSourceOptions = {
    type: "mysql",
    database: "db.mysql",
  };

  const dataSource = new DataSource(options);
  await dataSource.initialize();

  runSeeders(dataSource, {
    seeds: ["src/database/seeders/**/*{.ts,.js}"],
    factories: ["src/database/factories/**/*{.ts,.js}"],
  });
})();
