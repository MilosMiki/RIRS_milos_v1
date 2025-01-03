// services/vehicleService.js
const apiUrl = process.env.REACT_APP_BACKEND_URL;
const API_URL = `${apiUrl}/api/vehicle`;

// Fetch vehicle data
export const getVehicleData = async (token) => {
  try {
    const response = await fetch(`${API_URL}/vehicles`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.message };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteVehicle = async (vehicleId,token) => {
  try {
    const response = await fetch(`${API_URL}/vehicles/${vehicleId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.message };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const repairVehicle = async (vehicleId,token) => {
  try {
    const response = await fetch(`${API_URL}/vehicles/${vehicleId}/repair`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.message };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const unreserveVehicle = async (vehicleId,token) => {
  try {
    const response = await fetch(`${API_URL}/vehicles/${vehicleId}/unreserve`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.message };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const reserveVehicle = async (vehicleId, reservationData, token) => {
  try {
    const response = await fetch(`${API_URL}/vehicles/${vehicleId}/reserve`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reservationData), // Send reservation data in the body
    });

    const data = await response.json();
    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.message };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};


export const getAdminReservations = async (token) => {
  try {
    const response = await fetch(`${API_URL}/admin-reservations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.message };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};