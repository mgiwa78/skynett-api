import dotenv from "dotenv";

// Load the correct .env file based on the environment
const envFile =
  process.env.NODE_ENV === "production" ? ".env.production" : ".env";
dotenv.config({ path: envFile });

const JWT_SECRET = process.env.JWT_SECRET;
export const EMAIL = "mgiwa78@gmail.com";
export const PASSWORD = "rsdaxgcljgxyfgzj";
const MONGO_URI = process.env.MONGO_URI;

export { JWT_SECRET, MONGO_URI };
