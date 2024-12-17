import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReserveVehicle from '../components/ReserveVehicle';
import * as vehicleService from '../services/vehicleService';
import * as reservationService from '../services/reservationService';
import * as authService from '../services/authService';
import '@testing-library/jest-dom';


jest.mock('../services/vehicleService', () => ({
  getVehicleData: jest.fn(),
  deleteVehicle: jest.fn(),
  repairVehicle: jest.fn(),
  unreserveVehicle: jest.fn(),
}));

jest.mock('../services/reservationService', () => ({
  getReservationData: jest.fn(),
  getReservation: jest.fn(),
  deleteReservation: jest.fn(),
}));

jest.mock('../services/authService', () => ({
  getUserData: jest.fn(),
}));

const mockVehicles = [
  {
    vehicleId: '1',
    vehicleName: 'BMW',
    color: 'Black',
    year: 2000,
    image: 'image_url',
    engine: '316i',
    hp: 105,
    status: 'available',
    type: 'Car',
  },
  {
    vehicleId: '2',
    vehicleName: 'Piaggio',
    color: 'Black',
    year: 2000,
    image: 'image_url_2',
    engine: '125cc',
    hp: 10,
    status: 'available',
    type: 'Bike',
  },
  {
    vehicleId: '3',
    vehicleName: 'Fiat Doblo',
    color: 'White',
    year: 2004,
    image: 'image_url_2',
    engine: '1.9D',
    hp: 120,
    status: 'available',
    type: 'Van',
  },
  {
    vehicleId: '4',
    vehicleName: 'Ford Puma',
    color: 'Gray',
    year: 2008,
    image: 'image_url_2',
    engine: '2.2 HDi',
    hp: 120,
    status: 'available',
    type: 'Truck',
  },
];

const mockReservations = [];

beforeEach(() => {
  authService.getUserData.mockResolvedValue({
    success: true, // Ensure this passes the if condition
    data: {
      role: 'Admin', // You can mock different roles here as needed
    },
  });

  vehicleService.getVehicleData.mockResolvedValue({
    success: true, // Ensure this passes the if condition
    data: mockVehicles,
  });

  
  reservationService.getReservationData.mockResolvedValue({
    success: true, // Ensure this passes the if condition
    data: mockReservations,
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Reserve Component Tests', () => {

  beforeEach(() => {
    render(<ReserveVehicle 
      token="test-token" 
      setShowReserve={jest.fn()}
      setShowAddVehicle={jest.fn()}
      setShowAllCarReservations={jest.fn()}
      canReserve={jest.fn()}
      userReservationReset={jest.fn()}
      />);
  });

  test('renders "Show Bikes only" button and filters correctly after loading', async () => {
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    await waitFor(
      () => {
        expect(vehicleService.getVehicleData).toHaveBeenCalled();
        expect(reservationService.getReservationData).toHaveBeenCalled();
        expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  
    fireEvent.click(screen.getByRole('button', { name: /Show Bikes only/i }));

    const rows = screen.getAllByRole('row');
    expect(rows.some((row) => row.textContent.includes('Bike'))).toBe(true);
    expect(rows.some((row) => row.textContent.includes('Car'))).toBe(false);
    expect(rows.some((row) => row.textContent.includes('Van'))).toBe(false);
    expect(rows.some((row) => row.textContent.includes('Truck'))).toBe(false);
  });

  test('renders "Show Vans only" button and filters correctly after loading', async () => {
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    await waitFor(
      () => {
        expect(vehicleService.getVehicleData).toHaveBeenCalled();
        expect(reservationService.getReservationData).toHaveBeenCalled();
        expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  
    fireEvent.click(screen.getByRole('button', { name: /Show Vans only/i }));

    const rows = screen.getAllByRole('row');
    expect(rows.some((row) => row.textContent.includes('Bike'))).toBe(false);
    expect(rows.some((row) => row.textContent.includes('Car'))).toBe(false);
    expect(rows.some((row) => row.textContent.includes('Van'))).toBe(true);
    expect(rows.some((row) => row.textContent.includes('Truck'))).toBe(false);
  });

  test('renders "Show Trucks only" button and filters correctly after loading', async () => {
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    await waitFor(
      () => {
        expect(vehicleService.getVehicleData).toHaveBeenCalled();
        expect(reservationService.getReservationData).toHaveBeenCalled();
        expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  
    fireEvent.click(screen.getByRole('button', { name: /Show Trucks only/i }));

    const rows = screen.getAllByRole('row');
    expect(rows.some((row) => row.textContent.includes('Bike'))).toBe(false);
    expect(rows.some((row) => row.textContent.includes('Car'))).toBe(false);
    expect(rows.some((row) => row.textContent.includes('Van'))).toBe(false);
    expect(rows.some((row) => row.textContent.includes('Truck'))).toBe(true);
  });
  
  test('renders "Show Cars only" button and filters correctly after loading', async () => {
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    await waitFor(
      () => {
        expect(vehicleService.getVehicleData).toHaveBeenCalled();
        expect(reservationService.getReservationData).toHaveBeenCalled();
        expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  
    fireEvent.click(screen.getByRole('button', { name: /Show Cars only/i }));
    
    const rows = screen.getAllByRole('row');
    expect(rows.some((row) => row.textContent.includes('Bike'))).toBe(false);
    expect(rows.some((row) => row.textContent.includes('Car'))).toBe(true);
    expect(rows.some((row) => row.textContent.includes('Van'))).toBe(false);
    expect(rows.some((row) => row.textContent.includes('Truck'))).toBe(false);
  });
});
