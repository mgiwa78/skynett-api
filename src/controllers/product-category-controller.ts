import { Request, Response } from "express";
import { CategoryService } from "@services/category-service";

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  createCategory = async (req: Request, res: Response): Promise<Response> => {
    try {
      const category = await this.categoryService.createCategory(req.body);
      return res.status(201).json(category);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to create category", error: err.message });
    }
  };

  getCategoryById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const category = await this.categoryService.getCategoryById(
        parseInt(req.params.id)
      );
      if (!category)
        return res.status(404).json({ message: "Category not found" });

      return res.status(200).json(category);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to fetch category", error: err.message });
    }
  };

  getAllCategories = async (req: Request, res: Response): Promise<Response> => {
    try {
      const categories = await this.categoryService.getAllCategories();
      return res.status(200).json(categories);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to fetch categories", error: err.message });
    }
  };

  updateCategory = async (req: Request, res: Response): Promise<Response> => {
    try {
      const updatedCategory = await this.categoryService.updateCategory(
        parseInt(req.params.id),
        req.body
      );
      if (!updatedCategory)
        return res.status(404).json({ message: "Category not found" });

      return res.status(200).json(updatedCategory);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to update category", error: err.message });
    }
  };

  deleteCategory = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.categoryService.deleteCategory(
        parseInt(req.params.id)
      );
      if (!result)
        return res.status(404).json({ message: "Category not found" });

      return res.status(200).json({ message: "Category deleted successfully" });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to delete category", error: err.message });
    }
  };
}
