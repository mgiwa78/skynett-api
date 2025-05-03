import { Router } from "express";
import { GalleryController } from "@controllers/gallery.controller";

const gelleryRouter = Router();
const gelleryController = new GalleryController();

gelleryRouter.post("/", gelleryController.createGalleryEntry);
gelleryRouter.get("/", gelleryController.getAllGalleryEntries);
gelleryRouter.get("/:id", gelleryController.getGalleryEntryById);
gelleryRouter.put("/:id", gelleryController.updateGalleryEntry);
gelleryRouter.delete("/:id", gelleryController.deleteGalleryEntry);

export default gelleryRouter;
