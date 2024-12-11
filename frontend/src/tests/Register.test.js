import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from '../components/Register';
import '@testing-library/jest-dom';
import { createUserWithEmailAndPassword } from '../firebaseClient';
import { setDoc } from 'firebase/firestore';
import UploadLicense from '../components/UploadLicense';

// Mock firebase imports
jest.mock('../firebaseClient', () => ({
  auth: { currentUser: { accessToken: 'mock-token' } },
  createUserWithEmailAndPassword: jest.fn(),
  db: {},
}));

jest.mock('firebase/firestore', () => ({
  setDoc: jest.fn(),
  doc: jest.fn(),
}));

jest.mock('../components/UploadLicense', () => jest.fn(() => <div>Upload License Component</div>));

describe('Register Component', () => {
  const mockSetToken = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock data before each test
  });

  test('renders register form and handles user input', () => {
    render(<Register setToken={mockSetToken} />);

    // Check if form elements are rendered
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
  });

  test('handles successful registration and redirects to UploadLicense', async () => {
    // Mock successful firebase registration response
    createUserWithEmailAndPassword.mockResolvedValue({
      user: {
        email: 'testuser@example.com',
        uid: 'mock-uid',
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      },
    });
    setDoc.mockResolvedValue();

    render(<Register setToken={mockSetToken} />);

    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const registerButton = screen.getByRole('button', { name: /Register/i });

    fireEvent.change(emailInput, { target: { value: 'testuser@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(registerButton);

    // Wait for async operations (firebase)
    await waitFor(() => expect(createUserWithEmailAndPassword).toHaveBeenCalledTimes(1));

    // Check if the token is set
    expect(mockSetToken).toHaveBeenCalledWith('mock-token');

    // Check if UploadLicense component is rendered after successful registration
    
    const listAllVehicles = await waitFor(() => screen.getByText(/Upload License Component/i));
    expect(listAllVehicles).toBeInTheDocument();
  });

  test('displays error message if registration fails', async () => {
    // Mock failed firebase registration response
    createUserWithEmailAndPassword.mockRejectedValue(new Error('Registration failed'));

    render(<Register setToken={mockSetToken} />);

    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const registerButton = screen.getByRole('button', { name: /Register/i });

    fireEvent.change(emailInput, { target: { value: 'testuser@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(registerButton);

    // Wait for async operations (firebase)
    await waitFor(() => expect(createUserWithEmailAndPassword).toHaveBeenCalledTimes(1));

    // expecting to stay on the register screen
    const registerButton2 = screen.getByRole('button', { name: /Register/i });
    expect(registerButton2).toBeInTheDocument();
  });

  test('does not redirect to UploadLicense if registration fails', async () => {
    // Mock failed firebase registration response
    createUserWithEmailAndPassword.mockRejectedValue(new Error('Registration failed'));

    render(<Register setToken={mockSetToken} />);

    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const registerButton = screen.getByRole('button', { name: /Register/i });

    fireEvent.change(emailInput, { target: { value: 'testuser@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(registerButton);

    // Wait for async operations (firebase)
    await waitFor(() => expect(createUserWithEmailAndPassword).toHaveBeenCalledTimes(1));

    // Ensure UploadLicense is not rendered
    expect(screen.queryByText(/Upload License Component/i)).not.toBeInTheDocument();
  });

  test('shows error message when email or password is missing', () => {
    render(<Register setToken={mockSetToken} />);

    const registerButton = screen.getByRole('button', { name: /Register/i });
    fireEvent.click(registerButton);

    // expecting to stay on the register screen
    const registerButton2 = screen.getByRole('button', { name: /Register/i });
    expect(registerButton2).toBeInTheDocument();
  });
});
