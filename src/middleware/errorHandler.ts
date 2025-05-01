import { CustomError } from "@errors/custom-errors";
import logger from "@utils/logger";
import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    // logger.error(`CustomError - ${err.message}`, {
    //   method: req.method,
    //   url: req.url,
    //   status: err?.statusCode,
    //   stack: err.stack,
    // });
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  logger.error(`Internal Server Error - ${err.message}`, {
    method: req.method,
    url: req.url,
    status: 500,
    stack: err.stack,
  });
  return res.status(500).send({ errors: [{ message: err.message }] });
};
