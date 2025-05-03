import { Project } from "../entities/projects";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

export default class ProjectSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const projectRepository = dataSource.getRepository(Project);

    const projects = [
      {
        name: "Solar Power Plant",
        description: "Large-scale solar plant project",
        budget: 100000,
      },
      {
        name: "Wind Farm Project",
        description: "Wind energy farm construction",
        budget: 200000,
      },
    ];

    for (const projectData of projects) {
      const projectExists = await projectRepository.findOne({
        where: { name: projectData.name },
      });

      if (!projectExists) {
        const project = projectRepository.create(projectData);
        await projectRepository.save(project);
      }
    }

    console.log("Project seeder completed.");
  }
}
