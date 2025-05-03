import { Router } from "express";
import { ProjectController } from "@controllers/projects.controller";

const projectRouter = Router();
const projectController = new ProjectController();

projectRouter.post("/", projectController.createProject);
projectRouter.get("/", projectController.getAllProjects);
projectRouter.get("/:id", projectController.getProjectById);
projectRouter.put("/:id", projectController.updateProject);
projectRouter.delete("/:id", projectController.deleteProject);

export default projectRouter;
