import * as admin from "firebase-admin";
import { logger } from "../utils/logger";
import { env } from "./env.config";

try {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: env.FIREBASE_PROJECT_ID,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
      privateKey: env.FIREBASE_PRIVATE_KEY,
    }),
  });
  logger.info("Firebase initialized successfully");
} catch (error) {
  logger.error("Firebase admin initialization error:", error);
  process.exit(1);
}

export const auth = admin.auth();
