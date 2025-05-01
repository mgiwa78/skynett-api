import { CouponController } from "@controllers/coupon-controller";
import { Router } from "express";

const couponRouter = Router();
const couponController = new CouponController();

couponRouter.post("/", couponController.createCoupon);
couponRouter.get("/", couponController.getAllCoupons);
couponRouter.get("/:id", couponController.getCouponById);
couponRouter.get("/code/:code", couponController.getCouponByCode);
couponRouter.put("/:id", couponController.updateCoupon);
couponRouter.delete("/:id", couponController.deleteCoupon);

export default couponRouter;
