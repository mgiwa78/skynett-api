import { CouponService } from "@services/coupon-service";
import { Request, Response } from "express";

export class CouponController {
  private couponService: CouponService;

  constructor() {
    this.couponService = new CouponService();
  }

  getAllCoupons = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.couponService.getAllCoupons();
      return res.status(200).json(result);
    } catch (err: any) {
      return res
        .status(500)
        .json({ message: "Failed to fetch admins", error: err.message });
    }
  };

  createCoupon = async (req: Request, res: Response): Promise<Response> => {
    try {
      const coupon = await this.couponService.createCoupon(req.body);
      return res.status(201).json(coupon);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to create coupon", error: err.message });
    }
  };

  getCouponById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const couponId = parseInt(req.params.id);
      const coupon = await this.couponService.getCouponById(couponId);

      if (!coupon) {
        return res.status(404).json({ message: "Coupon not found" });
      }
      return res.status(200).json(coupon);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to fetch coupon", error: err.message });
    }
  };

  getCouponByCode = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { code } = req.params;
      const coupon = await this.couponService.getCouponByCode(code);

      if (!coupon) {
        return res.status(404).json({ message: "Coupon not found" });
      }
      return res.status(200).json(coupon);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to fetch coupon", error: err.message });
    }
  };

  updateCoupon = async (req: Request, res: Response): Promise<Response> => {
    try {
      const couponId = parseInt(req.params.id);
      const updatedCoupon = await this.couponService.updateCoupon(
        couponId,
        req.body
      );

      if (!updatedCoupon) {
        return res.status(404).json({ message: "Coupon not found" });
      }
      return res.status(200).json(updatedCoupon);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to update coupon", error: err.message });
    }
  };

  deactivateCoupon = async (req: Request, res: Response): Promise<Response> => {
    try {
      const couponId = parseInt(req.params.id);
      const deactivated = await this.couponService.deactivateCoupon(couponId);

      if (!deactivated) {
        return res.status(404).json({ message: "Coupon not found" });
      }
      return res
        .status(200)
        .json({ message: "Coupon deactivated successfully" });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to deactivate coupon", error: err.message });
    }
  };

  deleteCoupon = async (req: Request, res: Response): Promise<Response> => {
    try {
      const couponId = parseInt(req.params.id);
      const deleted = await this.couponService.deleteCoupon(couponId);

      if (!deleted) {
        return res.status(404).json({ message: "Coupon not found" });
      }
      return res.status(200).json({ message: "Coupon deleted successfully" });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to delete coupon", error: err.message });
    }
  };
}
