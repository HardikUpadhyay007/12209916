import type { Request, Response, NextFunction } from "express";
import { nanoid } from "nanoid";

type Level = "debug" | "info" | "warn" | "error" | "fatal";
type Stack = "backend" | "frontend";
type Package =
  | "cache"
  | "controller"
  | "cron_job"
  | "db"
  | "domain"
  | "handler"
  | "repository"
  | "route"
  | "service"
  | "api"
  | "component"
  | "hook"
  | "page"
  | "state"
  | "style"
  | "auth"
  | "config"
  | "middleware"
  | "utils";

interface ILog {
  logID: string;
  timestamp: Date;
  stack: Stack;
  level: Level;
  package: Package;
  message: string;
}

const logs: ILog[] = [];

export const logger = async (
  level: Level,
  stack: Stack,
  pkg: Package,
  message: string
) => {
  try {
    const logData: ILog = {
      logID: nanoid(),
      timestamp: new Date(),
      level,
      stack,
      package: pkg,
      message,
    };

    // Save to in-memory array
    logs.push(logData);

    // Also log to console
    console.log(
      `[${logData.timestamp.toISOString()}] [${logData.level.toUpperCase()}] [${
        logData.stack
      }/${logData.package}]: ${logData.message}`
    );

    // The code below is commented out because the test server is not available.
    // // Send to test server
    // if (process.env.LOG_API_ENDPOINT) {
    //   await axios.post(process.env.LOG_API_ENDPOINT, logData);
    // }
  } catch (error) {
    console.error("Failed to log message:", error);
  }
};

export const getLogs = () => {
  return logs;
};

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
