import { Request, Response } from "express";
import { CustomerService } from "@services/customer-service";

export class CustomerController {
  private customerService: CustomerService;

  constructor() {
    this.customerService = new CustomerService();
  }

  createCustomer = async (req: Request, res: Response): Promise<Response> => {
    try {
      const customer = await this.customerService.createCustomer(req.body);
      return res.status(201).json(customer);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to create customer", error: err.message });
    }
  };

  getCustomerById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const customer = await this.customerService.getCustomerById(
        parseInt(req.params.id)
      );
      if (!customer)
        return res.status(404).json({ message: "Customer not found" });

      return res.status(200).json(customer);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to fetch customer", error: err.message });
    }
  };

  getAllCustomers = async (req: Request, res: Response): Promise<Response> => {
    try {
      const customers = await this.customerService.getAllCustomers();
      return res.status(200).json(customers);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to fetch customers", error: err.message });
    }
  };

  updateCustomer = async (req: Request, res: Response): Promise<Response> => {
    try {
      const updatedCustomer = await this.customerService.updateCustomer(
        parseInt(req.params.id),
        req.body
      );
      if (!updatedCustomer)
        return res.status(404).json({ message: "Customer not found" });

      return res.status(200).json(updatedCustomer);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to update customer", error: err.message });
    }
  };

  deleteCustomer = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.customerService.deleteCustomer(
        parseInt(req.params.id)
      );
      if (!result)
        return res.status(404).json({ message: "Customer not found" });

      return res.status(200).json({ message: "Customer deleted successfully" });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to delete customer", error: err.message });
    }
  };
}
