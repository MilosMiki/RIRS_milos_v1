import { render, screen, fireEvent } from '@testing-library/react';
import AddVehicle from '../components/AddVehicle';
import { db, collection, doc, setDoc } from '../firebaseClient'; // Mock Firestore
import '@testing-library/jest-dom';  // Ensure jest-dom is imported for toBeInTheDocument()

jest.mock('../firebaseClient', () => ({
  db: {},
  collection: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
}));

describe('AddVehicle Component', () => {
  beforeEach(() => {
    // Mock the Firestore methods used in AddVehicle
    doc.mockReturnValue({
      id: 'mock-vehicle-id',  // Mock vehicleId returned by Firestore
    });
    collection.mockReturnValue({});
    setDoc.mockResolvedValue(Promise.resolve());
  });

  test('renders AddVehicle form and submits new vehicle', async () => {
    render(<AddVehicle token="test-token" setShowAddVehicle={jest.fn()} />);

    // Check if form fields are rendered
    expect(screen.getByPlaceholderText(/Vehicle Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Vehicle Color/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Vehicle Year/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Engine/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/HP/i)).toBeInTheDocument();

    // Simulate input for the form
    fireEvent.change(screen.getByPlaceholderText(/Vehicle Name/i), { target: { value: 'Car' } });
    fireEvent.change(screen.getByPlaceholderText(/Vehicle Color/i), { target: { value: 'Red' } });
    fireEvent.change(screen.getByPlaceholderText(/Vehicle Year/i), { target: { value: '2020' } });
    fireEvent.change(screen.getByPlaceholderText(/Engine/i), { target: { value: 'V6' } });
    fireEvent.change(screen.getByPlaceholderText(/HP/i), { target: { value: '250' } });

    // Simulate form submission
    fireEvent.click(screen.getByRole('button', { name: /Add vehicle/i }));

    // Check if the mock function was called to add the vehicle to Firestore
    expect(setDoc).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'mock-vehicle-id', // This is the first object that contains the `id`
      }),
      expect.objectContaining({
        vehicleId: 'mock-vehicle-id', // This is the second object that contains the rest of the vehicle data
        vehicleName: 'Car',
        color: 'Red',
        year: '2020',
        engine: 'V6',
        hp: '250',
        status: 'available',
        image: null, // Include the image field with a null value if that's the actual behavior
      })
    );
  });
});
