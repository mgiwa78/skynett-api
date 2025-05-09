import { AppDataSource } from "@config/ormconfig";
import { Coupon } from "@entities/coupon";
import { BaseRepository } from "./base.repository";

export class CouponRepository extends BaseRepository<Coupon> {
  constructor() {
    super(AppDataSource, Coupon);
  }

  protected getSearchableColumns(): string[] {
    return ["code"];
  }

  async findByCode(code: string): Promise<Coupon | null> {
    return this.findOne({ where: { code } });
  }
}
