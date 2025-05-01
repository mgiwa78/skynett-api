import { Gallery } from "@entities/gallery";
import { PaginatedResult } from "@repositories/base-repository";
import { GalleryRepository } from "@repositories/gallery-repository";

export class GalleryService {
  private galleryRepository: GalleryRepository;

  constructor() {
    this.galleryRepository = new GalleryRepository();
  }

  async createGalleryEntry(data: Partial<Gallery>): Promise<Gallery> {
    return this.galleryRepository.createEntity(data);
  }

  async getGalleryEntryById(id: number): Promise<Gallery | null> {
    return this.galleryRepository.findById(id);
  }

  async getAllGalleryEntries(): Promise<PaginatedResult<Gallery>> {
    return this.galleryRepository.findAll();
  }

  async updateGalleryEntry(
    id: number,
    data: Partial<Gallery>
  ): Promise<Gallery | null> {
    return this.galleryRepository.updateEntity(id, data);
  }

  async deleteGalleryEntry(id: number): Promise<boolean> {
    return this.galleryRepository.deleteEntity(id);
  }
}
