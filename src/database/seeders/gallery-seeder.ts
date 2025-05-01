import { Gallery } from "../entities/gallery";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

export default class GallerySeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const galleryRepository = dataSource.getRepository(Gallery);

    const galleryEntries = [
      {
        title: "Solar Panel Installation",
        imageUrl: "https://example.com/solar1.jpg",
      },
      {
        title: "Wind Turbine Field",
        imageUrl: "https://example.com/wind1.jpg",
      },
    ];

    for (const galleryData of galleryEntries) {
      const galleryExists = await galleryRepository.findOne({
        where: { title: galleryData.title },
      });

      if (!galleryExists) {
        const gallery = galleryRepository.create(galleryData);
        await galleryRepository.save(gallery);
      }
    }

    console.log("Gallery seeder completed.");
  }
}
