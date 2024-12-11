import { config } from "dotenv";

// Load test environment variables
config({ path: ".env.test" });

// Mock Firebase Admin
jest.mock("../config/firebase", () => ({
  auth: {
    createUser: jest.fn(),
    getUserByEmail: jest.fn(),
    verifyIdToken: jest.fn(),
    generateEmailVerificationLink: jest.fn(),
    generatePasswordResetLink: jest.fn(),
    updateUser: jest.fn(),
    getUser: jest.fn(),
    revokeRefreshTokens: jest.fn(),
  },
}));

// Global test setup
beforeAll(() => {
  // Add any global setup
});

// Global test teardown
afterAll(() => {
  // Add any global cleanup
});

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});
