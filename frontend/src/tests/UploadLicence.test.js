import { render, screen, fireEvent, waitFor, userEvent } from '@testing-library/react';
import UploadLicense from '../components/UploadLicense';
import { uploadLicense } from '../services/authService'; // Mock service
import '@testing-library/jest-dom';

jest.mock('../services/authService', () => ({
  uploadLicense: jest.fn(),
}));

test('uploads license successfully', async () => {
  uploadLicense.mockResolvedValue({ success: true, message: 'Upload successful' });

  const { container } = render(<UploadLicense token="mock-token" setLicenseUploaded={() => {}} />);

  // Select the file input field using class name (access the first element)
  const input = container.getElementsByClassName('file-input')[0]; // Make sure to target the first element
  
  const file = new File(['mock'], 'mock.jpg', { type: 'image/jpeg' });

  // Simulate file upload (using a mock file)
  fireEvent.change(input, { 
    target: { files: [file] } 
  });

  // Find the upload button and click it
  const uploadBtn = screen.getByRole('button', { name: /Upload/i });
  fireEvent.click(uploadBtn);

  // Check for success message
  await waitFor(() => expect(screen.getByText(/Upload successful/i)).toBeInTheDocument());
});

test('shows error message when no file is selected', async () => {
  render(<UploadLicense token="mock-token" setLicenseUploaded={() => {}} />);

  const uploadBtn = screen.getByRole('button', { name: /Upload/i });
  fireEvent.click(uploadBtn);

  // Check for error message
  expect(screen.getByText(/Please select a file and make sure you are logged in/i)).toBeInTheDocument();
});
