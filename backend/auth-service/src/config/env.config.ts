import { baseLogger } from "../utils/base-logger";

interface EnvConfig {
  PORT: number;
  NODE_ENV: string;
  FIREBASE_PROJECT_ID: string;
  FIREBASE_CLIENT_EMAIL: string;
  FIREBASE_PRIVATE_KEY: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  LOG_LEVEL: string;
}

const getEnvVar = (key: keyof EnvConfig, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    baseLogger.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
  return value;
};

export const env: EnvConfig = {
  PORT: parseInt(getEnvVar("PORT", "3001"), 10),
  NODE_ENV: getEnvVar("NODE_ENV", "development"),
  FIREBASE_PROJECT_ID: getEnvVar("FIREBASE_PROJECT_ID"),
  FIREBASE_CLIENT_EMAIL: getEnvVar("FIREBASE_CLIENT_EMAIL"),
  FIREBASE_PRIVATE_KEY: getEnvVar("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
  JWT_SECRET: getEnvVar("JWT_SECRET"),
  JWT_EXPIRES_IN: getEnvVar("JWT_EXPIRES_IN", "24h"),
  LOG_LEVEL: getEnvVar("LOG_LEVEL", "debug"),
};

// Log loaded configuration (excluding sensitive data)
baseLogger.info("Environment configuration loaded", {
  PORT: env.PORT,
  NODE_ENV: env.NODE_ENV,
  LOG_LEVEL: env.LOG_LEVEL,
});
