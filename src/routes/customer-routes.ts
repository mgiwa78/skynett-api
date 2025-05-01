import { Router } from "express";
import { CustomerController } from "@controllers/customer-controller";

const customerRouter = Router();
const customerController = new CustomerController();

customerRouter.post("/", customerController.createCustomer);
customerRouter.get("/", customerController.getAllCustomers);
customerRouter.get("/:id", customerController.getCustomerById);
customerRouter.put("/:id", customerController.updateCustomer);
customerRouter.delete("/:id", customerController.deleteCustomer);

export default customerRouter;
