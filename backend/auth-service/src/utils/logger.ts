import winston from "winston";
import path from "path";
import { env } from "../config/env.config";
import { baseLogger } from "./base-logger";

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

// Add colors to winston
winston.addColors(colors);

// Define custom log format
interface TransformableLogInfo extends winston.Logform.TransformableInfo {
  timestamp?: string;
}

// Define the format for logs
const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info: TransformableLogInfo) => {
    const { timestamp, level, message, ...rest } = info;
    const restString = Object.keys(rest).length
      ? ` ${JSON.stringify(rest)}`
      : "";
    return `${timestamp} ${level}: ${message}${restString}`;
  }),
);

// Create log directory if it doesn't exist
const logDir = "logs";
if (!require("fs").existsSync(logDir)) {
  require("fs").mkdirSync(logDir);
}

// Define where to store logs
const transports = [
  // Console logs
  new winston.transports.Console(),

  // Error logs
  new winston.transports.File({
    filename: path.join(logDir, "error.log"),
    level: "error",
  }),

  // All logs
  new winston.transports.File({
    filename: path.join(logDir, "all.log"),
  }),
];

// Create the logger
export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  levels,
  format,
  transports,
});

// If we're not in production, add console transport with simple format
if (env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}

// Transfer any logs from base logger
baseLogger.on("data", (log) => {
  logger.log(log);
});
