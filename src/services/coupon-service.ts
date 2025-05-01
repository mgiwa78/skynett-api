import { Coupon } from "@entities/coupon";
import {
  PaginatedResult,
  PaginationOptions,
} from "@repositories/base-repository";
import { CouponRepository } from "@repositories/coupon-repository";

export class CouponService {
  private couponRepository: CouponRepository;

  constructor() {
    this.couponRepository = new CouponRepository();
  }

  async getAllCoupons(
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<Coupon>> {
    return await this.couponRepository.findAll(options);
  }
  async createCoupon(couponData: Partial<Coupon>): Promise<Coupon> {
    const newCoupon = await this.couponRepository.create(couponData);
    return newCoupon;
  }

  async getCouponById(couponId: number): Promise<Coupon | null> {
    return await this.couponRepository.findById(couponId);
  }

  async getCouponByCode(code: string): Promise<Coupon | null> {
    return await this.couponRepository.findByCode(code);
  }

  async updateCoupon(
    couponId: number,
    couponData: Partial<Coupon>
  ): Promise<Coupon | null> {
    const coupon = await this.getCouponById(couponId);
    if (!coupon) return null;

    Object.assign(coupon, couponData);
    return await this.couponRepository.updateEntity(couponId, coupon);
  }

  async deactivateCoupon(couponId: number): Promise<boolean> {
    const coupon = await this.getCouponById(couponId);
    if (!coupon) return false;

    coupon.isActive = false;
    await this.couponRepository.updateEntity(couponId, coupon);
    return true;
  }

  async deleteCoupon(couponId: number): Promise<boolean> {
    const coupon = await this.getCouponById(couponId);
    if (!coupon) return false;

    await this.couponRepository.deleteEntity(coupon.id);
    return true;
  }
}
