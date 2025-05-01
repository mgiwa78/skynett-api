import { UserController } from "@controllers/admin-controller";
import { Router } from "express";

const userRouter = Router();
const userController = new UserController();

userRouter.post("/", userController.createUser);
userRouter.get("/:id", userController.getUserById);
userRouter.put("/:id", userController.updateUser);
userRouter.delete("/:id", userController.deleteUser);
userRouter.get("/", userController.getAllUsers);

export default userRouter;
