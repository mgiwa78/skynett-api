import { Project } from "@entities/projects";
import { PaginatedResult } from "@repositories/base-repository";
import { ProjectRepository } from "@repositories/project-repository";

export class ProjectService {
  private projectRepository: ProjectRepository;

  constructor() {
    this.projectRepository = new ProjectRepository();
  }

  async createProject(data: Partial<Project>): Promise<Project> {
    return this.projectRepository.createEntity(data);
  }

  async getProjectById(id: number): Promise<Project | null> {
    return this.projectRepository.findById(id);
  }

  async getAllProjects(): Promise<PaginatedResult<Project>> {
    return this.projectRepository.findAll();
  }

  async updateProject(
    id: number,
    data: Partial<Project>
  ): Promise<Project | null> {
    return this.projectRepository.updateEntity(id, data);
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projectRepository.deleteEntity(id);
  }
}
