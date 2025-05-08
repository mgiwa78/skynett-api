import cron from "node-cron";
import { ScraperService } from "@services/scraper.service";
import logger from "@utils/logger";

export class ScraperJob {
  private scraperService: ScraperService;

  constructor() {
    this.scraperService = new ScraperService();
  }

  start() {
    cron.schedule("0 2 * * *", async () => {
      try {
        logger.info("Starting scheduled product scraping job");
        await this.scraperService.scrapeProducts();
        logger.info("Completed scheduled product scraping job");
      } catch (error) {
        logger.error("Error in scheduled scraping job:", error);
      }
    });

    logger.info("Scraper job scheduled to run daily at 2 AM");
  }
}
