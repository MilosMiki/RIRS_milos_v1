import { render, screen, waitFor } from '@testing-library/react';
import ViewRes from '../components/ViewReservation';
import { getVehicleData } from '../services/vehicleService';
import '@testing-library/jest-dom';

// Mocking the service
jest.mock('../services/vehicleService');

describe('ViewRes Component', () => {
  const mockToken = 'mock-token';
  const mockReservationData = {
    vehicleId: '123',
    startDate: '2024-12-10',
    endDate: '2024-12-12',
    status: 'Confirmed',
  };

  test('displays reservation data when matching vehicle is found', async () => {
    // Mock vehicle data response
    getVehicleData.mockResolvedValue({
      success: true,
      data: [
        {
          vehicleId: '123',
          vehicleName: 'Car A',
        },
      ],
    });

    render(<ViewRes token={mockToken} reservationData={mockReservationData} />);

    // Wait for the vehicle data to be fetched and displayed
    await waitFor(() => expect(screen.getByText(/Vehicle Name:/i)).toBeInTheDocument());

    // Check if reservation data is displayed correctly
    expect(screen.getByText('Car A')).toBeInTheDocument();
    expect(screen.getByText('2024-12-10')).toBeInTheDocument();
    expect(screen.getByText('2024-12-12')).toBeInTheDocument();
    expect(screen.getByText('Confirmed')).toBeInTheDocument();
  });

  test('does not display reservation data if no matching vehicle is found', async () => {
    // Mock vehicle data response with no matching vehicle
    getVehicleData.mockResolvedValue({
      success: true,
      data: [
        {
          vehicleId: '456',
          vehicleName: 'Car B',
        },
      ],
    });

    render(<ViewRes token={mockToken} reservationData={mockReservationData} />);

    // Wait for the vehicle data to be fetched
    await waitFor(() => expect(screen.queryByText(/Vehicle Name:/i)).not.toBeInTheDocument());

    // Ensure that no reservation data is displayed
    expect(screen.queryByText('Car A')).not.toBeInTheDocument();
  });

  test('shows loading state when vehicles are being fetched', () => {
    // Mock vehicle data response with delay
    getVehicleData.mockResolvedValue({
      success: true,
      data: [
        {
          vehicleId: '123',
          vehicleName: 'Car A',
        },
      ],
    });

    render(<ViewRes token={mockToken} reservationData={mockReservationData} />);

    // Check if the component is still rendering during the fetch
    expect(screen.queryByText('Car A')).not.toBeInTheDocument();
  });
});
