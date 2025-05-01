// config.ts
import dotenv from "dotenv";

// Load environment variables based on NODE_ENV
const environment = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${environment}` });

interface Config {
  nodeEnv: string;
  port: number;
  db: {
    host: string;
    type: any;
    port: number;
    user: string;
    password: string;
    name: string;
    synchronize: boolean;
    logging: boolean;
  };
  email: {
    user: string;
    password: string;
  };
  jwtSecret: string;
}

const config: Config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3000", 10),
  db: {
    host: process.env.DB_HOST || "localhost",
    type: process.env.DB_TYPE || "mysql",
    port: parseInt(process.env.DB_PORT || "8080", 10),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    name: process.env.DB_NAME || "app",
    synchronize: process.env.DB_SYNCRONIZE === "true" ? true : false || true,
    logging: process.env.DB_LOGGING === "true" ? true : false || false,
  },
  email: {
    user: process.env.EMAIL_USER || "",
    password: process.env.EMAIL_PASS || "",
  },
  jwtSecret: process.env.JWT_SECRET || "defaultsecret",
};

export default config;
