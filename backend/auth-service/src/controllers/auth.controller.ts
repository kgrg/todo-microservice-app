import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { AuthError } from "../errors/auth.error";
import { logger } from "../utils/logger";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, displayName } = req.body;
      const result = await this.authService.register({
        email,
        password,
        displayName,
      });
      res.status(201).json(result);
    } catch (error) {
      logger.error("Registration error:", error);
      next(new AuthError("Registration failed"));
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login({ email, password });
      res.json(result);
    } catch (error) {
      logger.error("Login error:", error);
      next(new AuthError("Login failed"));
    }
  };

  public logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authService.logout(req.user!.uid);
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      next(new AuthError("Logout failed"));
    }
  };

  public verifyEmail = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { token } = req.params;
      await this.authService.verifyEmail(token);
      res.json({ message: "Email verified successfully" });
    } catch (error) {
      next(new AuthError("Email verification failed"));
    }
  };

  public forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { email } = req.body;
      await this.authService.forgotPassword(email);
      res.json({ message: "Password reset email sent" });
    } catch (error) {
      next(new AuthError("Failed to send password reset email"));
    }
  };

  public resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { token, newPassword } = req.body;
      await this.authService.resetPassword(token, newPassword);
      res.json({ message: "Password reset successfully" });
    } catch (error) {
      next(new AuthError("Password reset failed"));
    }
  };

  public getCurrentUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await this.authService.getCurrentUser(req.user!.uid);
      res.json(result);
    } catch (error) {
      next(new AuthError("Failed to get user information"));
    }
  };
}
