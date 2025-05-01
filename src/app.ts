import express from "express";
import { json } from "body-parser";
import "express-async-errors";
import cors from "cors";
import rootRouter from "./routes/rootRouter";
import { loadPartials } from "./emails/partials";

import http from "http";
import { initializeSocket } from "@utils/socket";
import { AppDataSource } from "@config/ormconfig";
import { NotFoundError } from "@errors/custom-errors";
import { errorHandler } from "@middleware/errorHandler";

const app = express();
loadPartials();

const server = http.createServer(app);
initializeSocket(server);

const whitelist = ["http://localhost:5173", "http://localhost:5230"];
// const corsOptions = {
//   origin: "*",
//   credentials: true,
// };
const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.set("trust proxy", true);
app.use(json());

app.use(rootRouter);
app.all("*", async (req, res, next) => {
  next(new NotFoundError());
});

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

const PORT = process.env.PORT || 9001;
app.use(errorHandler);

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully.");
    server.listen(PORT);
  })
  .catch((error) =>
    console.log("Error during Data Source initialization:", error)
  );

console.log(`Server running on port ${PORT}`);

export { app };
