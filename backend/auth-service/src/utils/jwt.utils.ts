import jwt from "jsonwebtoken";
import { AuthError } from "../errors/auth.error";
import { env } from "../config/env.config";

export const generateJWT = (userId: string): string => {
  try {
    return jwt.sign({ userId }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    });
  } catch (error) {
    throw new AuthError("Failed to generate token");
  }
};

export const verifyJWT = (token: string): { userId: string } => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as { userId: string };
  } catch (error) {
    throw new AuthError("Invalid token");
  }
};
