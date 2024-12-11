const { getVehicles, repairVehicle, reserveVehicle, deleteVehicle, reportMalfunction } = require('../controllers/vehicleController');
const { db } = require('../config/firebaseConfig');

jest.mock('../config/firebaseConfig');

describe('Vehicle Controller Tests', () => {
  describe('getVehicles', () => {
    it('should return a list of vehicles when data exists', async () => {
      const mockVehicles = [
        { vehicleId: '1', vehicleName: 'Car A', status: 'available' },
        { vehicleId: '2', vehicleName: 'Car B', status: 'repair' },
      ];

      db.collection.mockReturnValue({
        get: jest.fn().mockResolvedValue({
          forEach: (callback) => mockVehicles.forEach((vehicle) => callback({ data: () => vehicle })),
        }),
      });

      const req = { user: { uid: '123' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getVehicles(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockVehicles);
    });
  });

  describe('repairVehicle', () => {
    it('should return 400 if the vehicle is reserved', async () => {
      db.collection.mockReturnValue({
        doc: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue({ exists: true, data: () => ({ status: 'reserved' }) }),
        }),
      });

      const req = { params: { vehicleId: '1' }, user: { uid: '123' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await repairVehicle(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Cannot change status, vehicle is reserved.' });
    });
  });


  describe('reserveVehicle', () => {
    it('should return 400 if startDate or endDate is missing', async () => {
	  const req = { params: { vehicleId: '1' }, body: {}, user: { uid: '123' } };
	  const res = {
		status: jest.fn().mockReturnThis(),
		json: jest.fn(),
	  };

	  await reserveVehicle(req, res);

	  expect(res.status).toHaveBeenCalledWith(400);
	  expect(res.json).toHaveBeenCalledWith({
		success: false,
		message: 'Start date and end date are required.',
	  });
	});
  });
  
  describe('deleteVehicle', () => {
    it('should return 404 if no vehicles match the ID', async () => {
	  db.collection.mockReturnValue({
		where: jest.fn().mockReturnValue({
		  get: jest.fn().mockResolvedValue({ empty: true }),
		}),
	  });

	  const req = { params: { vehicleId: 'nonexistent' }, user: { uid: '123' } };
	  const res = {
		status: jest.fn().mockReturnThis(),
		json: jest.fn(),
	  };

	  await deleteVehicle(req, res);

	  expect(res.status).toHaveBeenCalledWith(404);
	  expect(res.json).toHaveBeenCalledWith({ message: 'No vehicle found with the specified ID' });
	});
  });
  
  describe('reportMalfunction', () => {
	it('should successfully add a malfunction report', async () => {
	  db.collection.mockReturnValue({
		add: jest.fn().mockResolvedValue({ id: 'newMalfunctionId' }),
	  });

	  const req = { user: { uid: '123' }, body: { vehicleId: '1', description: 'Flat tire' } };
	  const res = {
		status: jest.fn().mockReturnThis(),
		json: jest.fn(),
	  };

	  await reportMalfunction(req, res);

	  expect(res.status).toHaveBeenCalledWith(201);
	  expect(res.json).toHaveBeenCalledWith({ message: 'Malfunction reported successfully.' });
	});
  });
});
