import { Request, Response, NextFunction } from "express";
import { auth } from "../config/firebase";
import { AuthError } from "../errors/auth.error";

export const validateAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) {
      throw new AuthError("No token provided");
    }

    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    next(new AuthError("Invalid token"));
  }
};
