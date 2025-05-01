import express from "express";
import authRoutes from "./auth-routes";
import paymentRouter from "./payment-routes";
import productCategoryRouter from "./product-category-routes";
import productRouter from "./product-routes";
import orderRouter from "./order-routes";
import distributorRouter from "./distributor-routes";
import couponRouter from "./coupon-routes";
import faqRouter from "./faq-routes";
import userRouter from "./admin-routes";
import customerRouter from "./customer-routes";
import feedbackRouter from "./feedback-routes";
import projectRouter from "./project-routes";
import gelleryRouter from "./gellery-routes";

const routerRouter = express.Router();

routerRouter.use("/auth", authRoutes);
routerRouter.use("/users", userRouter);
routerRouter.use("/orders", orderRouter);
routerRouter.use("/categories", productCategoryRouter);
routerRouter.use("/products", productRouter);
routerRouter.use("/customers", customerRouter);
routerRouter.use("/feedbacks", feedbackRouter);
routerRouter.use("/order", productRouter);
routerRouter.use("/gallery", gelleryRouter);
routerRouter.use("/payments", paymentRouter);
routerRouter.use("/projects", projectRouter);
routerRouter.use("/faqs", faqRouter);
routerRouter.use("/distributors", distributorRouter);
routerRouter.use("/coupons", couponRouter);

export default routerRouter;
