import { ProjectService } from "@services/projects-service";
import { Request, Response } from "express";

export class ProjectController {
  private projectService: ProjectService;

  constructor() {
    this.projectService = new ProjectService();
  }

  createProject = async (req: Request, res: Response): Promise<Response> => {
    try {
      const project = await this.projectService.createProject(req.body);
      return res.status(201).json(project);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to create project", error: err.message });
    }
  };

  getProjectById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const project = await this.projectService.getProjectById(
        parseInt(req.params.id)
      );
      if (!project)
        return res.status(404).json({ message: "Project not found" });

      return res.status(200).json(project);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to fetch project", error: err.message });
    }
  };

  getAllProjects = async (req: Request, res: Response): Promise<Response> => {
    try {
      const projects = await this.projectService.getAllProjects();
      return res.status(200).json(projects);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to fetch projects", error: err.message });
    }
  };

  updateProject = async (req: Request, res: Response): Promise<Response> => {
    try {
      const updatedProject = await this.projectService.updateProject(
        parseInt(req.params.id),
        req.body
      );
      if (!updatedProject)
        return res.status(404).json({ message: "Project not found" });

      return res.status(200).json(updatedProject);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to update project", error: err.message });
    }
  };

  deleteProject = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.projectService.deleteProject(
        parseInt(req.params.id)
      );
      if (!result)
        return res.status(404).json({ message: "Project not found" });

      return res.status(200).json({ message: "Project deleted successfully" });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to delete project", error: err.message });
    }
  };
}
