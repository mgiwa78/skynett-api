const fs = require("fs-extra");

async function copyAssets() {
  try {
    await fs.copy("src/emails/Images", "dist/emails/images");
    await fs.copy("src/emails/partials", "dist/emails/partials");
  } catch (err) {
    console.error("Error copying assets:", err);
  }
}

copyAssets();
