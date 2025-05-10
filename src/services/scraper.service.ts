import puppeteer from "puppeteer";
import { AppDataSource } from "@config/ormconfig";
import { Product, ProductStatus } from "@entities/product";
import { Category } from "@entities/category";
import { Brand } from "@entities/brand";
import logger from "@utils/logger";
import crypto from "crypto";
import { generateProductCode } from "@utils/helpers";
import fs from "fs";
import path from "path";
import https from "https";

export class ScraperService {
  private productRepository = AppDataSource.getRepository(Product);
  private categoryRepository = AppDataSource.getRepository(Category);
  private brandRepository = AppDataSource.getRepository(Brand);
  private readonly uploadsDir = path.join(process.cwd(), "uploads", "products");

  constructor() {
    // Ensure uploads directory exists
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  private generateHash(data: any): string {
    const stringified = JSON.stringify(data);
    return crypto.createHash("sha256").update(stringified).digest("hex");
  }

  private compareHashes(hash1: string, hash2: string): boolean {
    return crypto.timingSafeEqual(
      Buffer.from(hash1, "hex"),
      Buffer.from(hash2, "hex")
    );
  }

  private async downloadImage(
    url: string,
    productCode: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const fileName = `${productCode}-${Date.now()}.jpg`;
      const filePath = path.join(this.uploadsDir, fileName);
      const file = fs.createWriteStream(filePath);

      https
        .get(url, (response) => {
          if (response.statusCode !== 200) {
            reject(
              new Error(`Failed to download image: ${response.statusCode}`)
            );
            return;
          }

          response.pipe(file);

          file.on("finish", () => {
            file.close();
            resolve(`/uploads/products/${fileName}`);
          });

          file.on("error", (err) => {
            fs.unlink(filePath, () => {}); // Delete the file if there's an error
            reject(err);
          });
        })
        .on("error", (err) => {
          fs.unlink(filePath, () => {}); // Delete the file if there's an error
          reject(err);
        });
    });
  }

  async scrapeProducts() {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
        "--window-size=1920x1080",
      ],
      timeout: 60000, // Increase timeout to 60 seconds
    });

    try {
      const page = await browser.newPage();

      // Set a longer default timeout
      page.setDefaultNavigationTimeout(60000);
      page.setDefaultTimeout(60000);

      // Set user agent to avoid detection
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      );

      // Enable request interception to block unnecessary resources
      await page.setRequestInterception(true);
      page.on("request", (request) => {
        const resourceType = request.resourceType();
        if (
          resourceType === "image" ||
          resourceType === "stylesheet" ||
          resourceType === "font" ||
          resourceType === "media"
        ) {
          request.abort();
        } else {
          request.continue();
        }
      });

      await page.setViewport({ width: 1920, height: 1080 });

      logger.info("Navigating to products page...");
      await page.goto(
        "https://shop.gennextechnologies.com/?s=&post_type=product",
        {
          waitUntil: "domcontentloaded",
          timeout: 60000,
        }
      );

      // Wait for the product grid to be visible
      await page.waitForSelector(".products", { timeout: 60000 });

      // Get total number of pages
      const totalPages = await page.evaluate(() => {
        const paginationLinks = Array.from(
          document.querySelectorAll(".page-numbers")
        );
        const pageNumbers = paginationLinks
          .map((link) => {
            const text = link.textContent?.trim();
            return text && !isNaN(Number(text)) ? Number(text) : null;
          })
          .filter((num): num is number => num !== null);
        return Math.max(...pageNumbers);
      });

      logger.info(`Found ${totalPages} pages to scrape`);

      // Array to store all product links
      let allProductLinks: string[] = [];

      // Scrape each page
      for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
        logger.info(`Scraping page ${currentPage} of ${totalPages}`);

        // Navigate to the current page
        if (currentPage > 1) {
          await page.goto(
            `https://shop.gennextechnologies.com/page/${currentPage}/?s=&post_type=product`,
            {
              waitUntil: "domcontentloaded",
              timeout: 60000,
            }
          );
          await page.waitForSelector(".products", { timeout: 60000 });
        }

        // Extract product links from current page
        const pageProductLinks = await page.evaluate(() => {
          const links = Array.from(
            document.querySelectorAll(
              ".mf-product-thumbnail a[href*='/product/']"
            )
          );
          return links.map((link) => (link as HTMLAnchorElement).href);
        });

        allProductLinks = [...allProductLinks, ...pageProductLinks];
        logger.info(
          `Found ${pageProductLinks.length} products on page ${currentPage}`
        );

        // Add a small delay between pages
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      logger.info(`Total products found: ${allProductLinks.length}`);

      // Process all products
      for (const link of allProductLinks) {
        try {
          logger.info(`Processing product at ${link}`);
          await page.goto(link, {
            waitUntil: "domcontentloaded",
            timeout: 60000,
          });

          // Wait for key elements to be visible
          await page.waitForSelector(".product_title", { timeout: 60000 });

          const productData = await page.evaluate(() => {
            const name = document
              .querySelector(".woo-loop-product__title a")
              ?.textContent?.trim();

            // Get both regular and sale price
            const originalPrice = document
              .querySelector(".price del .woocommerce-Price-amount")
              ?.textContent?.trim();
            const currentPrice = document
              .querySelector(".price ins .woocommerce-Price-amount")
              ?.textContent?.trim();
            const regularPrice = document
              .querySelector(".price .woocommerce-Price-amount")
              ?.textContent?.trim();

            let price = null;
            let discountedPrice = null;
            if (currentPrice) {
              price = currentPrice;
              discountedPrice = originalPrice || null;
            } else {
              price = regularPrice;
              discountedPrice = null;
            }

            const description = document
              .querySelector(".woocommerce-product-details__short-description")
              ?.textContent?.trim();

            const sku = document
              .querySelector("[data-product_sku]")
              ?.getAttribute("data-product_sku");

            const imageUrl = document
              .querySelector(".mf-product-thumbnail img")
              ?.getAttribute("src");

            // Get brand from meta section
            const brandMeta = document
              .querySelector(".meta-brand .meta-value")
              ?.textContent?.trim();
            const brandProductMeta = document
              .querySelector(
                '.product_meta .posted_in a[href*="product-brand"]'
              )
              ?.textContent?.trim();
            const brands = [
              ...new Set([brandMeta, brandProductMeta].filter(Boolean)),
            ];

            // Get categories from meta section
            const metaCategories = Array.from(
              document.querySelectorAll(
                '.product_meta .posted_in a[href*="product-category"]'
              )
            )
              .map((a) => a.textContent?.trim())
              .filter(Boolean);

            // Combine all categories
            const categories = [...new Set([...metaCategories])];

            // Get additional details
            const additionalDetails: Record<string, string> = {};
            const detailsTable = document.querySelector(
              ".woocommerce-product-attributes"
            );
            if (detailsTable) {
              const rows = detailsTable.querySelectorAll("tr");
              rows.forEach((row) => {
                const label = row.querySelector("th")?.textContent?.trim();
                const value = row.querySelector("td")?.textContent?.trim();
                if (label && value) {
                  additionalDetails[label] = value;
                }
              });
            }

            // Get discount percentage if available
            const discountElement = document.querySelector(".onsale.ribbon");
            if (discountElement) {
              const discountText = discountElement.textContent?.trim() || "";
              const discountMatch = discountText.match(/(\d+)%/);
              if (discountMatch) {
                additionalDetails["Discount"] = discountMatch[1] + "%";
              }
            }

            return {
              name,
              price,
              discountedPrice,
              description,
              sku,
              imageUrl,
              brands,
              categories,
              additionalDetails,
            };
          });

          // Generate product code if SKU is not available
          const productCode = productData.sku || generateProductCode();

          // Parse price and discountedPrice as numbers
          let priceNum = productData.price
            ? parseFloat(productData.price.replace(/[^0-9.-]+/g, ""))
            : 0;
          let discountedPriceNum = productData.discountedPrice
            ? parseFloat(productData.discountedPrice.replace(/[^0-9.-]+/g, ""))
            : null;

          // Ensure discountedPrice is never more than or equal to price
          if (discountedPriceNum !== null && discountedPriceNum >= priceNum) {
            // Swap if discountedPrice is more than or equal to price
            const temp = priceNum;
            priceNum = discountedPriceNum;
            discountedPriceNum = temp;
          }
          // If after swap, still not a discount, set to null
          if (discountedPriceNum === null || discountedPriceNum >= priceNum) {
            discountedPriceNum = null;
          }

          // Generate hash of current product data
          const currentHash = this.generateHash({
            name: productData.name,
            price: priceNum,
            discountedPrice: discountedPriceNum,
            description: productData.description,
            sku: productData.sku,
            productCode: productCode,
            imageUrl: productData.imageUrl,
            brands: productData.brands,
            categories: productData.categories,
            additionalDetails: productData.additionalDetails,
          });

          // Find or create categories
          const productCategories = await Promise.all(
            productData.categories.map(async (categoryName: string) => {
              let cat = await this.categoryRepository.findOne({
                where: { name: categoryName },
              });

              if (!cat) {
                cat = await this.categoryRepository.save({
                  name: categoryName,
                  description: `Category for ${categoryName} products`,
                });
              }

              return cat;
            })
          );

          // Find or create brands
          const productBrands = await Promise.all(
            productData.brands.map(async (brandName: string) => {
              let b = await this.brandRepository.findOne({
                where: { name: brandName },
              });

              if (!b) {
                b = await this.brandRepository.save({
                  name: brandName,
                  description: `Brand for ${brandName} products`,
                });
              }

              return b;
            })
          );

          // Download and save the image
          let localImagePath = null;
          if (productData.imageUrl) {
            try {
              localImagePath = await this.downloadImage(
                productData.imageUrl,
                productCode
              );
              logger.info(`Downloaded image for product ${productData.name}`);
            } catch (error) {
              logger.error(
                `Failed to download image for product ${productData.name}:`,
                error
              );
            }
          }

          // Save to database
          const existingProduct = await this.productRepository.findOne({
            where: [{ name: productData.name }],
          });

          const productToSave = {
            name: productData.name,
            description: productData.description || "",
            price: priceNum,
            discountedPrice: discountedPriceNum,
            image: localImagePath || productData.imageUrl, // Use local path if available, fallback to URL
            stock: 0,
            productCode: productCode,
            status: ProductStatus.SCRAPED,
            details: productData.additionalDetails,
            scrapedHash: currentHash,
          };

          if (existingProduct) {
            if (
              existingProduct.scrapedHash &&
              this.compareHashes(existingProduct.scrapedHash, currentHash)
            ) {
              logger.info(`Skipping unchanged product: ${productData.name}`);
              continue;
            }

            await this.productRepository.update(
              existingProduct.id,
              productToSave
            );

            // Then update relationships separately
            const updatedProduct = await this.productRepository.findOne({
              where: { id: existingProduct.id },
              relations: ["categories", "brands"],
            });

            if (updatedProduct) {
              updatedProduct.categories = productCategories;
              updatedProduct.brands = productBrands;
              await this.productRepository.save(updatedProduct);
            }

            logger.info(`Updated product: ${productData.name}`);
          } else {
            // For new products, we can set relationships directly
            await this.productRepository.save({
              ...productToSave,
              categories: productCategories,
              brands: productBrands,
            });
            logger.info(`Created product: ${productData.name}`);
          }

          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
          logger.error(`Error processing product at ${link}:`, error);
          continue;
        }
      }
    } catch (error) {
      logger.error("Scraping error:", error);
      throw error;
    } finally {
      await browser.close();
    }
  }
}
