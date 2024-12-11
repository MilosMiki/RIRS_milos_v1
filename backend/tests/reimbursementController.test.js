const { submitReimbursement, getPendingReimbursements, updateReimbursementStatus } = require('../controllers/reimbursementController');
const { db } = require('../config/firebaseConfig');
const cloudinary = require('cloudinary').v2;

jest.mock('../config/firebaseConfig');
jest.mock('cloudinary', () => ({
  v2: {
    uploader: {
      upload_stream: jest.fn(),
    },
  },
}));

describe('Reimbursement Controller Tests', () => {
  describe('submitReimbursement', () => {

    it('should return 400 if file is not provided', async () => {
      const mockReq = { user: { uid: 'test-user' }, body: { cost: 100, description: 'Test reimbursement' } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await submitReimbursement(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invoice image is required.' });
    });
  });

  describe('getPendingReimbursements', () => {
    it('should return all pending reimbursements for managers', async () => {
      const mockSnapshot = {
        docs: [
          { id: '1', data: () => ({ userId: 'user1', cost: 100, description: 'Test', status: 'Pending' }) },
        ],
      };

      db.collection.mockReturnValue({
        where: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue(mockSnapshot),
        }),
      });

      const mockReq = { user: { role: 'Manager' } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getPendingReimbursements(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith([
        { id: '1', userId: 'user1', cost: 100, description: 'Test', status: 'Pending' },
      ]);
    });

    it('should return 403 for non-managers', async () => {
      const mockReq = { user: { role: 'Employee' } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getPendingReimbursements(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Only managers can review reimbursements.' });
    });
  });

  describe('updateReimbursementStatus', () => {
    it('should update the reimbursement status successfully', async () => {
      const mockReq = {
        user: { role: 'Manager' },
        body: { id: '1', status: 'Approved' },
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      db.collection.mockReturnValue({
        doc: jest.fn().mockReturnValue({
          update: jest.fn().mockResolvedValue(),
        }),
      });

      await updateReimbursementStatus(mockReq, mockRes);

      expect(db.collection).toHaveBeenCalledWith('reimbursements');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Reimbursement request Approved.',
      });
    });

    it('should return 403 for non-managers', async () => {
      const mockReq = { user: { role: 'Employee' }, body: { id: '1', status: 'Approved' } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await updateReimbursementStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Only managers can update reimbursement status.' });
    });

    it('should return 400 for invalid status', async () => {
      const mockReq = { user: { role: 'Manager' }, body: { id: '1', status: 'InvalidStatus' } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await updateReimbursementStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid status update.' });
    });
  });
});
