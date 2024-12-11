import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

describe('App Component Tests', () => {
  describe('Navigation Tests', () => {
    test('renders the app title', () => {
      render(<App />);
      expect(screen.getByText(/Vehicle Management System/i)).toBeInTheDocument();
    });

    test('toggles between login and register screens', () => {
      render(<App />);
      const toggleButton = screen.getByText(/Switch to Register/i);
      fireEvent.click(toggleButton);
      expect(screen.getByText(/Switch to Login/i)).toBeInTheDocument();
    });

    test('renders profile screen when View Profile button is clicked', async () => {
	  render(<App />);

	  // Simulate entering login details and submitting
	  fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'admin@a.com' } });
	  fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: '123123' } });
	  fireEvent.click(screen.getByRole('button', { name: /Login/i }));

	  // Wait for the "View Profile" button to appear
	  const viewProfileButton = await waitFor(() => screen.getByRole('button', { name: /View Profile/i }));

	  // Click the "View Profile" button
	  fireEvent.click(viewProfileButton);

	  // Check for profile details
	  expect(screen.getByText(/Profile/i)).toBeInTheDocument();
	});
  });

  describe('UI Interaction Tests', () => {
    test('shows logout button after login', async () => {
      render(<App />);

      // Simulate login
      fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'admin@a.com' } });
      fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: '123123' } });
      fireEvent.click(screen.getByRole('button', { name: /Login/i }));

      // Wait for the "Log Out" button
      const logoutButton = await waitFor(() => screen.getByRole('button', { name: /Log Out/i }));

      // Check for the "Log Out" button
      expect(logoutButton).toBeInTheDocument();
    });
  });
});
