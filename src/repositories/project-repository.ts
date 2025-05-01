import { DataSource } from "typeorm";
import { BaseRepository } from "@repositories/base-repository";
import { AppDataSource } from "@config/ormconfig";
import { Project } from "@entities/projects";

export class ProjectRepository extends BaseRepository<Project> {
  constructor() {
    super(AppDataSource, Project);
  }
}
