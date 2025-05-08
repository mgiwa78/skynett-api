import { Router } from "express";
import { ScraperController } from "@controllers/scraper.controller";

const router = Router();
const scraperController = new ScraperController();

// Test endpoint to trigger scraping
router.post("/test", scraperController.testScraper);

export default router;
