import fs from "fs-extra";
import path from "path";

const copyAssets = async (): Promise<void> => {
  try {
    // Create logs directory in development
    if (process.env.NODE_ENV !== "production") {
      const logsDir = path.join(process.cwd(), "logs");
      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir);
      }
    }

    // Copy email partials and images
    const emailsDir = path.join(process.cwd(), "src", "emails");
    const distEmailsDir = path.join(process.cwd(), "dist", "emails");

    const partialsDir = path.join(emailsDir, "partials");
    const imagesDir = path.join(emailsDir, "images");
    const distPartialsDir = path.join(distEmailsDir, "partials");
    const distImagesDir = path.join(distEmailsDir, "images");

    // Copy partials if they exist
    if (fs.existsSync(partialsDir)) {
      await fs.copy(partialsDir, distPartialsDir);
      console.log("Email partials copied successfully!");
    } else {
      console.log("No email partials to copy.");
    }

    // Copy images if they exist
    if (fs.existsSync(imagesDir)) {
      await fs.copy(imagesDir, distImagesDir);
      console.log("Email images copied successfully!");
    } else {
      console.log("No email images to copy.");
    }
  } catch (error) {
    console.error("Error copying assets:", error);
    process.exit(1);
  }
};

// Execute if this is the main module
if (require.main === module) {
  copyAssets()
    .then(() => console.log("Assets copy completed"))
    .catch((error) => {
      console.error("Failed to copy assets:", error);
      process.exit(1);
    });
}

export default copyAssets;
