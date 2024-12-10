// tests/routes.test.js
const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/authRoutes');

// Mock Firebase and Upload Middleware
jest.mock('../config/firebaseConfig', () => ({
  admin: {
    auth: () => ({
      verifyIdToken: jest.fn(() => Promise.resolve({ uid: 'test-user-id' })),
    }),
  },
  db: {
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(() => Promise.resolve({ exists: true, data: () => ({ role: 'Admin' }) })),
      })),
    })),
  },
}));

jest.mock('../middlewares/uploadMiddleware', () => ({
  single: jest.fn(() => (req, res, next) => {
    req.file = { originalname: 'license.jpg', buffer: Buffer.from('fake-image-data') };
    next();
  }),
}));

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Ensure clean mocks
  });

  describe('GET /api/auth/profile', () => {
    it('should return user profile when authorized', async () => {
      const mockToken = 'valid-test-token';
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).not.toBe(401);
      expect(response.status).not.toBe(403);
    });

    it('should return 401 if no authorization token is provided', async () => {
      const response = await request(app).get('/api/auth/profile');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Authorization token missing');
    });
  });

  describe('POST /api/auth/upload-license', () => {

    it('should return 401 if no authorization token is provided for upload', async () => {
      const response = await request(app).post('/api/auth/upload-license');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Authorization token missing');
    });
  });
});
