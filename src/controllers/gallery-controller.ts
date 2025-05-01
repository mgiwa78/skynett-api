import { Request, Response } from "express";
import { GalleryService } from "@services/gallery-service";

export class GalleryController {
  private galleryService: GalleryService;

  constructor() {
    this.galleryService = new GalleryService();
  }

  createGalleryEntry = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const galleryEntry = await this.galleryService.createGalleryEntry(
        req.body
      );
      return res.status(201).json(galleryEntry);
    } catch (err) {
      return res
        .status(500)
        .json({
          message: "Failed to create gallery entry",
          error: err.message,
        });
    }
  };

  getGalleryEntryById = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const galleryEntry = await this.galleryService.getGalleryEntryById(
        parseInt(req.params.id)
      );
      if (!galleryEntry)
        return res.status(404).json({ message: "Gallery entry not found" });

      return res.status(200).json(galleryEntry);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to fetch gallery entry", error: err.message });
    }
  };

  getAllGalleryEntries = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const galleryEntries = await this.galleryService.getAllGalleryEntries();
      return res.status(200).json(galleryEntries);
    } catch (err) {
      return res
        .status(500)
        .json({
          message: "Failed to fetch gallery entries",
          error: err.message,
        });
    }
  };

  updateGalleryEntry = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const updatedGalleryEntry = await this.galleryService.updateGalleryEntry(
        parseInt(req.params.id),
        req.body
      );
      if (!updatedGalleryEntry)
        return res.status(404).json({ message: "Gallery entry not found" });

      return res.status(200).json(updatedGalleryEntry);
    } catch (err) {
      return res
        .status(500)
        .json({
          message: "Failed to update gallery entry",
          error: err.message,
        });
    }
  };

  deleteGalleryEntry = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const result = await this.galleryService.deleteGalleryEntry(
        parseInt(req.params.id)
      );
      if (!result)
        return res.status(404).json({ message: "Gallery entry not found" });

      return res
        .status(200)
        .json({ message: "Gallery entry deleted successfully" });
    } catch (err) {
      return res
        .status(500)
        .json({
          message: "Failed to delete gallery entry",
          error: err.message,
        });
    }
  };
}
