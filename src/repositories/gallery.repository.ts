import { DataSource } from "typeorm";
import { BaseRepository } from "@repositories/base.repository";
import { Gallery } from "@entities/gallery";
import { AppDataSource } from "@config/ormconfig";

export class GalleryRepository extends BaseRepository<Gallery> {
  constructor() {
    super(AppDataSource, Gallery);
  }

  protected getSearchableColumns(): string[] {
    return ["title", "description", "imageUrl"];
  }
}
