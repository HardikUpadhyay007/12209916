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
