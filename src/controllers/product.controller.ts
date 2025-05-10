import { ProductService } from "@services/products.service";
import { Request, Response } from "express";
import { PaginationOptions } from "@repositories/base.repository";
import { FileService } from "@services/file.service";

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  createProduct = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { image, otherImages, ...productData } = req.body;

      if (image) {
        const imagePath = await FileService.saveImage(image, "product");
        productData.image = imagePath;
      }

      if (otherImages && Array.isArray(otherImages)) {
        const otherImagesPaths = await Promise.all(
          otherImages.map(async (img) => {
            if (img) {
              return await FileService.saveImage(img, "product");
            }
            return null;
          })
        );
        productData.otherImages = otherImagesPaths.filter(
          (path) => path !== null
        );
      }
      console.log(productData);
      const product = await this.productService.createProduct(productData);
      return res.status(201).json(product);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to create product", error: err.message });
    }
  };

  getProductById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const product = await this.productService.getProductById(req.params.id);
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
      const { image, otherImages, ...productData } = req.body;

      // Handle main image upload if provided
      if (image) {
        const imagePath = await FileService.saveImage(image);
        productData.image = imagePath;
      }

      // Handle other images upload if provided
      if (otherImages && Array.isArray(otherImages)) {
        const otherImagesPaths = await Promise.all(
          otherImages.map(async (img) => {
            if (img) {
              return await FileService.saveImage(img);
            }
            return null;
          })
        );
        productData.otherImages = otherImagesPaths.filter(
          (path) => path !== null
        );
      }

      const updatedProduct = await this.productService.updateProduct(
        req.params.id,
        productData
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
      const product = await this.productService.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Delete the main product image if it exists
      if (product.image) {
        await FileService.deleteFile(product.image);
      }

      // Delete other product images if they exist
      if (product.otherImages && product.otherImages.length > 0) {
        await Promise.all(
          product.otherImages.map(async (imagePath) => {
            if (imagePath) {
              await FileService.deleteFile(imagePath);
            }
          })
        );
      }

      const result = await this.productService.deleteProduct(req.params.id);
      return res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to delete product", error: err.message });
    }
  };
}
