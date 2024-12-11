import winston from "winston";

// Create a basic console logger for startup
const baseLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple(),
  ),
  transports: [new winston.transports.Console()],
});

export { baseLogger };
