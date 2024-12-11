import request from 'supertest';
import { app } from '../../server';
import { AuthService } from '../../services/auth.service';
import { auth } from '../../config/firebase';

jest.mock('../../config/firebase');
jest.mock('../../services/auth.service');

describe('Auth API Integration Tests', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'Password123!',
    displayName: 'Test User',
  };

  const authToken = 'test-auth-token';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const expectedResponse = {
        token: authToken,
        user: {
          id: 'test-uid',
          email: testUser.email,
          displayName: testUser.displayName,
          emailVerified: false,
        },
      };

      jest.spyOn(AuthService.prototype, 'register')
        .mockResolvedValueOnce(expectedResponse);

      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body).toEqual(expectedResponse);
    });

    it('should return validation error for invalid input', async () => {
      const invalidUser = {
        email: 'invalid-email',
        password: '123',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser)
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login user successfully', async () => {
      const loginData = {
        email: testUser.email,
        password: testUser.password,
      };

      const expectedResponse = {
        token: authToken,
        user: {
          id: 'test-uid',
          email: testUser.email,
          displayName: testUser.displayName,
          emailVerified: true,
        },
      };

      jest.spyOn(AuthService.prototype, 'login')
        .mockResolvedValueOnce(expectedResponse);

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toEqual(expectedResponse);
    });

    it('should return error for invalid credentials', async () => {
      const invalidLogin = {
        email: testUser.email,
        password: 'wrongpassword',
      };

      jest.spyOn(AuthService.prototype, 'login')
        .mockRejectedValueOnce(new Error('Invalid credentials'));

      await request(app)
        .post('/api/auth/login')
        .send(invalidLogin)
        .expect(401);
    });
  });

  describe('Protected Routes', () => {
    beforeEach(() => {
      jest.spyOn(auth, 'verifyIdToken')
        .mockResolvedValue({ uid: 'test-uid' } as any);
    });

    describe('POST /api/auth/logout', () => {
      it('should logout user successfully', async () => {
        jest.spyOn(AuthService.prototype, 'logout')
          .mockResolvedValueOnce(undefined);

        const response = await request(app)
          .post('/api/auth/logout')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body).toEqual({ 
          message: 'Logged out successfully' 
        });
      });

      it('should return error when no auth token provided', async () => {
        await request(app)
          .post('/api/auth/logout')
          .expect(401);
      });
    });

    describe('GET /api/auth/me', () => {
      it('should get current user successfully', async () => {
        const expectedUser = {
          user: {
            id: 'test-uid',
            email: testUser.email,
            displayName: testUser.displayName,
            emailVerified: true,
          },
        };

        jest.spyOn(AuthService.prototype, 'getCurrentUser')
          .mockResolvedValueOnce(expectedUser);

        const response = await request(app)
          .get('/api/auth/me')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body).toEqual(expectedUser);
      });

      it('should return error when token is invalid', async () => {
        jest.spyOn(auth, 'verifyIdToken')
          .mockRejectedValueOnce(new Error('Invalid token'));

        await request(app)
          .get('/api/auth/me')
          .set('Authorization', 'Bearer invalid-token')
          .expect(401);
      });
    });
  });
}); 