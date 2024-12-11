import { auth } from "../config/firebase";
import { AuthError } from "../errors/auth.error";
import { generateJWT, verifyJWT } from "../utils/jwt.utils";
import { logger } from "../utils/logger";

interface UserCredentials {
  email: string;
  password: string;
  displayName?: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    displayName?: string;
    emailVerified: boolean;
  };
}

export class AuthService {
  /**
   * Register a new user
   */
  async register(credentials: UserCredentials): Promise<AuthResponse> {
    try {
      const { email, password, displayName } = credentials;

      // Create user in Firebase
      const userRecord = await auth.createUser({
        email,
        password,
        displayName,
        emailVerified: false,
      });

      // Generate JWT token
      const token = await generateJWT(userRecord.uid);

      // Send verification email
      const verificationLink = await auth.generateEmailVerificationLink(email);
      // TODO: Implement email sending service
      logger.info(`Verification link generated: ${verificationLink}`);

      return {
        token,
        user: {
          id: userRecord.uid,
          email: userRecord.email!,
          displayName: userRecord.displayName,
          emailVerified: userRecord.emailVerified,
        },
      };
    } catch (error) {
      logger.error("Registration error:", error);
      throw new AuthError("Failed to register user");
    }
  }

  /**
   * Login user
   */
  async login(credentials: UserCredentials): Promise<AuthResponse> {
    try {
      const { email } = credentials;

      // Get user by email
      const userRecord = await auth.getUserByEmail(email);

      // Generate JWT token
      const token = await generateJWT(userRecord.uid);

      return {
        token,
        user: {
          id: userRecord.uid,
          email: userRecord.email!,
          displayName: userRecord.displayName,
          emailVerified: userRecord.emailVerified,
        },
      };
    } catch (error) {
      logger.error("Login error:", error);
      throw new AuthError("Invalid credentials");
    }
  }

  /**
   * Logout user
   */
  async logout(userId: string): Promise<void> {
    try {
      // Revoke all refresh tokens for user
      await auth.revokeRefreshTokens(userId);
      logger.info(`Logged out user: ${userId}`);
    } catch (error) {
      logger.error("Logout error:", error);
      throw new AuthError("Failed to logout user");
    }
  }

  /**
   * Verify email
   */
  async verifyEmail(token: string): Promise<void> {
    try {
      // Verify the action code
      await auth.verifyIdToken(token);
      logger.info("Email verified successfully");
    } catch (error) {
      logger.error("Email verification error:", error);
      throw new AuthError("Invalid verification token");
    }
  }

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<void> {
    try {
      // Generate password reset link
      const resetLink = await auth.generatePasswordResetLink(email);
      // TODO: Implement email sending service
      logger.info(`Password reset link generated: ${resetLink}`);
    } catch (error) {
      logger.error("Password reset request error:", error);
      throw new AuthError("Failed to process password reset request");
    }
  }

  /**
   * Reset password
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      // Verify the action code
      await auth.verifyIdToken(token);

      // Get user from token
      const decodedToken = await auth.verifyIdToken(token);

      // Update password
      await auth.updateUser(decodedToken.uid, {
        password: newPassword,
      });

      logger.info("Password reset successfully");
    } catch (error) {
      logger.error("Password reset error:", error);
      throw new AuthError("Failed to reset password");
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(userId: string): Promise<Omit<AuthResponse, "token">> {
    try {
      const userRecord = await auth.getUser(userId);

      return {
        user: {
          id: userRecord.uid,
          email: userRecord.email!,
          displayName: userRecord.displayName,
          emailVerified: userRecord.emailVerified,
        },
      };
    } catch (error) {
      logger.error("Get user error:", error);
      throw new AuthError("Failed to get user information");
    }
  }
}
