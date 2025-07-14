import type { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger("error", "backend", "handler", `Unhandled error: ${err.message}`);
  res.status(500).json({ error: "Something went wrong on our end." });
};
