const { getReservations, deleteReservation, getReservation } = require('../controllers/reserveController');
const { db } = require('../config/firebaseConfig');

jest.mock('../config/firebaseConfig');

describe('Reserve Controller Tests', () => {
  const mockReservations = [
    {
      reservationId: '1',
      vehicleId: 'vehicle1',
      userId: 'user1',
      startDate: '2024-12-01',
      endDate: '2024-12-10',
      status: 'confirmed',
    },
  ];

  describe('getReservations', () => {
    it('should return all reservations when data exists', async () => {
      db.collection.mockReturnValue({
        get: jest.fn().mockResolvedValue({
          forEach: (callback) => mockReservations.forEach((reservation) => callback({ data: () => reservation })),
        }),
      });

      const req = { user: { uid: 'test-user' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getReservations(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockReservations);
    });

    it('should return 500 on database error', async () => {
      db.collection.mockReturnValue({
        get: jest.fn().mockRejectedValue(new Error('Database error')),
      });

      const req = { user: { uid: 'test-user' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getReservations(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error fetching reservations',
        error: 'Database error',
      });
    });
  });

  describe('getReservation', () => {
    it('should return a reservation when it exists', async () => {
      db.collection.mockReturnValue({
        doc: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue({
            exists: true,
            id: '1',
            data: () => mockReservations[0],
          }),
        }),
      });

      const req = { user: { uid: 'test-user' }, params: { resId: '1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getReservation(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id: '1',
        ...mockReservations[0],
      });
    });

    it('should return 404 if reservation does not exist', async () => {
      db.collection.mockReturnValue({
        doc: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue({ exists: false }),
        }),
      });

      const req = { user: { uid: 'test-user' }, params: { resId: '1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getReservation(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Reservation not found' });
    });
  });

  describe('deleteReservation', () => {
    it('should delete a reservation when it exists', async () => {
      const mockBatch = {
        delete: jest.fn(),
        commit: jest.fn().mockResolvedValue(),
      };

      db.collection.mockReturnValue({
        where: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue({
            empty: false,
            forEach: (callback) => callback({ ref: 'mockRef' }),
          }),
        }),
      });
      db.batch.mockReturnValue(mockBatch);

      const req = { user: { uid: 'test-user' }, params: { resId: '1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await deleteReservation(req, res);

      expect(mockBatch.delete).toHaveBeenCalledWith('mockRef');
      expect(mockBatch.commit).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Reservation with id '1' successfully deleted",
      });
    });

    it('should return 404 if no reservations match the ID', async () => {
      db.collection.mockReturnValue({
        where: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue({ empty: true }),
        }),
      });

      const req = { user: { uid: 'test-user' }, params: { resId: 'nonexistent' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await deleteReservation(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No reservation found with the specified ID',
      });
    });
  });
});
