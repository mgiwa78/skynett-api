import { Request, Response } from "express";
import { ScraperService } from "@services/scraper.service";

export class ScraperController {
  private scraperService: ScraperService;

  constructor() {
    this.scraperService = new ScraperService();
  }

  testScraper = async (req: Request, res: Response): Promise<Response> => {
    try {
      await this.scraperService.scrapeProducts();
      return res
        .status(200)
        .json({ message: "Scraping completed successfully" });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to scrape products",
        error: error.message,
      });
    }
  };
}
