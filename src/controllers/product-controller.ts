import { ProductService } from "@services/products-service";
import { Request, Response } from "express";
import { PaginationOptions } from "@repositories/base-repository";

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  createProduct = async (req: Request, res: Response): Promise<Response> => {
    try {
      const product = await this.productService.createProduct(req.body);
      return res.status(201).json(product);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to create product", error: err.message });
    }
  };

  getProductById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const product = await this.productService.getProductById(
        parseInt(req.params.id)
      );
      if (!product)
        return res.status(404).json({ message: "Product not found" });

      return res.status(200).json(product);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to fetch product", error: err.message });
    }
  };

  getAllProducts = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { page, limit, search, sort, filters } = req.query;
      const paginationOptions: PaginationOptions = {
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        search: search as string,
        sort: sort as string,
        filters: filters ? JSON.parse(filters as string) : undefined,
      };
      const products = await this.productService.getAllProducts(
        paginationOptions
      );
      return res.status(200).json(products);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to fetch products", error: err.message });
    }
  };

  updateProduct = async (req: Request, res: Response): Promise<Response> => {
    try {
      const updatedProduct = await this.productService.updateProduct(
        parseInt(req.params.id),
        req.body
      );
      if (!updatedProduct)
        return res.status(404).json({ message: "Product not found" });

      return res.status(200).json(updatedProduct);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to update product", error: err.message });
    }
  };

  deleteProduct = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.productService.deleteProduct(
        parseInt(req.params.id)
      );
      if (!result)
        return res.status(404).json({ message: "Product not found" });

      return res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to delete product", error: err.message });
    }
  };
}
