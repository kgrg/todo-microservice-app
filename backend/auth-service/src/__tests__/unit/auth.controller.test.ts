import { Request, Response } from 'express';
import { AuthController } from '../../controllers/auth.controller';
import { AuthService } from '../../services/auth.service';
import { AuthError } from '../../errors/auth.error';

jest.mock('../../services/auth.service');

describe('AuthController', () => {
  let authController: AuthController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    authController = new AuthController();
    mockRequest = {
      body: {},
      params: {},
      user: { uid: 'test-uid' } as any,
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerData = {
      email: 'test@example.com',
      password: 'Password123!',
      displayName: 'Test User',
    };

    it('should successfully register a new user', async () => {
      mockRequest.body = registerData;
      const expectedResponse = {
        token: 'test-token',
        user: {
          id: 'test-uid',
          email: registerData.email,
          displayName: registerData.displayName,
          emailVerified: false,
        },
      };

      jest.spyOn(AuthService.prototype, 'register')
        .mockResolvedValueOnce(expectedResponse);

      await authController.register(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle registration errors', async () => {
      mockRequest.body = registerData;
      const error = new Error('Registration failed');
      
      jest.spyOn(AuthService.prototype, 'register')
        .mockRejectedValueOnce(error);

      await authController.register(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(AuthError));
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const loginData = {
      email: 'test@example.com',
      password: 'Password123!',
    };

    it('should successfully login a user', async () => {
      mockRequest.body = loginData;
      const expectedResponse = {
        token: 'test-token',
        user: {
          id: 'test-uid',
          email: loginData.email,
          displayName: 'Test User',
          emailVerified: true,
        },
      };

      jest.spyOn(AuthService.prototype, 'login')
        .mockResolvedValueOnce(expectedResponse);

      await authController.login(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle login errors', async () => {
      mockRequest.body = loginData;
      const error = new Error('Invalid credentials');

      jest.spyOn(AuthService.prototype, 'login')
        .mockRejectedValueOnce(error);

      await authController.login(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(AuthError));
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should successfully logout a user', async () => {
      jest.spyOn(AuthService.prototype, 'logout')
        .mockResolvedValueOnce(undefined);

      await authController.logout(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.json).toHaveBeenCalledWith({ 
        message: 'Logged out successfully' 
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle logout errors', async () => {
      const error = new Error('Logout failed');

      jest.spyOn(AuthService.prototype, 'logout')
        .mockRejectedValueOnce(error);

      await authController.logout(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(AuthError));
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  describe('verifyEmail', () => {
    it('should successfully verify email', async () => {
      mockRequest.params = { token: 'valid-token' };

      jest.spyOn(AuthService.prototype, 'verifyEmail')
        .mockResolvedValueOnce(undefined);

      await authController.verifyEmail(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.json).toHaveBeenCalledWith({ 
        message: 'Email verified successfully' 
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle email verification errors', async () => {
      mockRequest.params = { token: 'invalid-token' };
      const error = new Error('Invalid token');

      jest.spyOn(AuthService.prototype, 'verifyEmail')
        .mockRejectedValueOnce(error);

      await authController.verifyEmail(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(AuthError));
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  describe('forgotPassword', () => {
    it('should successfully process forgot password request', async () => {
      mockRequest.body = { email: 'test@example.com' };

      jest.spyOn(AuthService.prototype, 'forgotPassword')
        .mockResolvedValueOnce(undefined);

      await authController.forgotPassword(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.json).toHaveBeenCalledWith({ 
        message: 'Password reset email sent' 
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle forgot password errors', async () => {
      mockRequest.body = { email: 'invalid@example.com' };
      const error = new Error('User not found');

      jest.spyOn(AuthService.prototype, 'forgotPassword')
        .mockRejectedValueOnce(error);

      await authController.forgotPassword(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(AuthError));
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    const resetData = {
      token: 'valid-token',
      newPassword: 'NewPassword123!',
    };

    it('should successfully reset password', async () => {
      mockRequest.body = resetData;

      jest.spyOn(AuthService.prototype, 'resetPassword')
        .mockResolvedValueOnce(undefined);

      await authController.resetPassword(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.json).toHaveBeenCalledWith({ 
        message: 'Password reset successfully' 
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle password reset errors', async () => {
      mockRequest.body = resetData;
      const error = new Error('Invalid token');

      jest.spyOn(AuthService.prototype, 'resetPassword')
        .mockRejectedValueOnce(error);

      await authController.resetPassword(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(AuthError));
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  describe('getCurrentUser', () => {
    it('should successfully get current user', async () => {
      const expectedUser = {
        user: {
          id: 'test-uid',
          email: 'test@example.com',
          displayName: 'Test User',
          emailVerified: true,
        },
      };

      jest.spyOn(AuthService.prototype, 'getCurrentUser')
        .mockResolvedValueOnce(expectedUser);

      await authController.getCurrentUser(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.json).toHaveBeenCalledWith(expectedUser);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle get current user errors', async () => {
      const error = new Error('User not found');

      jest.spyOn(AuthService.prototype, 'getCurrentUser')
        .mockRejectedValueOnce(error);

      await authController.getCurrentUser(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(AuthError));
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });
}); 