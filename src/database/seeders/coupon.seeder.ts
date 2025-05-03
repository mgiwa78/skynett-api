import { Coupon } from "../entities/coupon";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

function generateRandomCouponCode(length: number = 8): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export default class CouponSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const couponRepository = dataSource.getRepository(Coupon);

    const numberOfCoupons = 10;

    for (let i = 0; i < numberOfCoupons; i++) {
      const code = generateRandomCouponCode();
      let coupon = await couponRepository.findOne({ where: { code } });
      if (!coupon) {
        coupon = couponRepository.create({
          code,
          discountAmount: parseFloat((Math.random() * 50 + 10).toFixed(2)),
          isActive: true,
          expiresAt: new Date(
            Date.now() + getRandomInt(1, 30) * 24 * 60 * 60 * 1000
          ),
          usageLimit: getRandomInt(1, 100),
          timesUsed: 0,
        });
        await couponRepository.save(coupon);
      }
    }

    console.log("Coupon seeder completed.");
  }
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
