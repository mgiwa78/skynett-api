import { SystemSetting } from "database/entities/config";
import { BaseRepository } from "./base.repository";
import { AppDataSource } from "@config/ormconfig";

export class SystemSettingRepository extends BaseRepository<SystemSetting> {
  constructor() {
    super(AppDataSource, SystemSetting);
  }
}
