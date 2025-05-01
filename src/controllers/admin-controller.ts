import { UserService } from "@services/user-service";
import { Request, Response } from "express";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  createUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const user = await this.userService.createUser(req.body);
      return res.status(201).json(user);
    } catch (err: any) {
      return res
        .status(500)
        .json({ message: "Failed to create user", error: err.message });
    }
  };

  getUserById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const user = await this.userService.getUserById(+req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      return res.status(200).json(user);
    } catch (err: any) {
      return res
        .status(500)
        .json({ message: "Failed to fetch user", error: err.message });
    }
  };

  updateUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const updated = await this.userService.updateUser(
        +req.params.id,
        req.body
      );
      if (!updated) return res.status(404).json({ message: "User not found" });
      return res.status(200).json(updated);
    } catch (err: any) {
      return res
        .status(500)
        .json({ message: "Failed to update user", error: err.message });
    }
  };

  deleteUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const deleted = await this.userService.deleteUser(+req.params.id);
      if (!deleted) return res.status(404).json({ message: "User not found" });
      return res.status(200).json({ message: "User deleted successfully" });
    } catch (err: any) {
      return res
        .status(500)
        .json({ message: "Failed to delete user", error: err.message });
    }
  };

  getAllUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.userService.getAllUsers();
      return res.status(200).json(result);
    } catch (err: any) {
      return res
        .status(500)
        .json({ message: "Failed to fetch users", error: err.message });
    }
  };
}
