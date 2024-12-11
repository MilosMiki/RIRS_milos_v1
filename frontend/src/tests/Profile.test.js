import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Profile from '../components/Profile';
import { getUserData, uploadLicense } from '../services/authService';
import '@testing-library/jest-dom';

jest.mock('../services/authService');

test('renders profile and uploads license', async () => {
  // Mock the getUserData response
  getUserData.mockResolvedValue({
    success: true,
    data: {
      email: 'driver@a.com',
      role: 'Driver',
      licenseImageUrl: 'mock-licensed-image-url.jpg',
    },
  });
});

test('shows error message if uploading empty file', async () => {
  render(<Profile token="mock-token" setShowProfile={() => {}} />);

  const uploadBtn = screen.getByRole('button', { name: /Upload License/i });
  fireEvent.click(uploadBtn);

  await waitFor(() => expect(screen.getByText(/Please select a file to upload/i)).toBeInTheDocument());
});
