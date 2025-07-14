import type { Request, Response, NextFunction } from "express";
import { logger } from "../backend/src/utils/logger";

export const loggingMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    const { method, originalUrl, ip, headers } = req;
    const userAgent = headers["user-agent"];
    const referrer = headers["referer"] || "N/A";
    const { statusCode } = res;

    const message = `[${method}] ${originalUrl} - ${statusCode} [${duration}ms] - IP: ${ip} - User-Agent: ${userAgent} - Referrer: ${referrer}`;
    logger("info", "backend", "middleware", message);
  });
  next();
};
