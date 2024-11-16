// components/ReserveVehicle.js
import React, { useState, useEffect } from 'react';
import { getUserData } from '../services/authService';
import { getVehicleData, deleteVehicle, repairVehicle } from '../services/vehicleService';
import ReserveVehicleForm from '../components/ReserveVehicleForm';

function Reserve({ token, setShowReserve, setShowAddVehicle }) {
  const [message, setMessage] = useState('');
  const [vehicles, setVehicles] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewVehicle,setViewVehicle] = useState(null);
  const [reserveVehicleId,setReserveVehicleId] = useState(null);
  const [role, setRole] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const userData = await getUserData(token);
      if (userData.success) {
        setRole(userData.data.role || 'Driver');
      }
    };
    fetchData();
  }, [token]);

  const canAddVehicle = role === 'Admin';
  const canRepairVehicle = role === 'Admin';
  const canDeleteVehicle = role === 'Admin';
  const canViewAllReservations = role === 'Admin' || role === 'Manager';

  const fetchVehicles = async () => {
    setLoading(true); // Start loading
    try {
      const vehicleSnapshot = await getVehicleData(token);
      console.log(vehicleSnapshot.data);
      if (vehicleSnapshot.success) {
        setVehicles(vehicleSnapshot.data);
      } else {
        setMessage(vehicleSnapshot.error || 'Failed to load vehicle data');
      }
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [token]);

  const handleReserve = (vehicleId) => {
    setReserveVehicleId(vehicleId);
  };

  const handleView = (vehicle) => {
    setViewVehicle(vehicle);
  };

  async function handleRepair(vehicleId) {
    const result = await repairVehicle(vehicleId, token);
    if (result.success) {
      console.log(`Vehicle ${vehicleId} status updated.`);
      // refresh the list of vehicles here
      fetchVehicles();
    } else {
      console.error(`Failed to update vehicle status for ID: ${vehicleId}`);
    }
  }

  async function handleDelete(vehicleId) {
    const result = await deleteVehicle(vehicleId, token);
    if (result.success) {
      console.log(`Vehicle ${vehicleId} deleted successfully.`);
      // refresh the list of vehicles here
      fetchVehicles();
    } else {
      console.error('Error deleting vehicle:', result.error);
    }
  }

  // Reserve a vehicle, form
  if (reserveVehicleId != null) return (
    <ReserveVehicleForm 
      token={token} 
      reserveVehicleId={reserveVehicleId} 
      setReserveVehicleId={setReserveVehicleId} 
      fetchVehicles={fetchVehicles}
    />
  );

  // View a single vehicle
  if(viewVehicle!=null) return(
    <div className="vehicle-detail">
      <h2>{viewVehicle.vehicleName} Details</h2>
      <img src={viewVehicle.image} alt={viewVehicle.vehicleName} />
      <table className="vehicle-table">
        <tbody>
          <tr>
            <td><strong>Vehicle Name:</strong></td>
            <td>{viewVehicle.vehicleName}</td>
          </tr>
          <tr>
            <td><strong>Engine:</strong></td>
            <td>{viewVehicle.engine}</td>
          </tr>
          <tr>
            <td><strong>Horsepower:</strong></td>
            <td>{viewVehicle.hp} HP</td>
          </tr>
          <tr>
            <td><strong>Color:</strong></td>
            <td>{viewVehicle.color}</td>
          </tr>
          <tr>
            <td><strong>Year:</strong></td>
            <td>{viewVehicle.year}</td>
          </tr>
          <tr>
            <td><strong>Status:</strong></td>
            <td>{viewVehicle.status}</td>
          </tr>
        </tbody>
      </table>
      <button onClick={() => setViewVehicle(null)} className='goto-register-button'>Back to vehicle list</button>
    </div>
  )

  //View a list of vehicles to reserve (or if admin, all vehicles that exist)
  return (
    <div className="vehicle-container">
      <h2>List of all vehicles</h2>
      <p className="profile-email">
        <div>
          {vehicles && vehicles.length > 0 ? (
            <table className="vehicle-table">
              <thead>
                  <tr>
                      <th>Vehicle Name</th>
                      <th>Engine</th>
                      <th>Actions</th>
                  </tr>
              </thead>
              <tbody>
                  {vehicles.map((vehicle, index) => (
                    (vehicle.status === 'available' || canViewAllReservations) ? (
                      <tr key={vehicle.vehicleId}>
                          <td>{vehicle.vehicleName}</td>
                          <td>{vehicle.engine} - {vehicle.hp} HP</td>
                          <td>
                            <div className="vehicle-actions">
                              <button onClick={() => handleView(vehicle)} className="view-button">
                                  View
                              </button>
                              <button onClick={() => handleReserve(vehicle.vehicleId)} className="reserve-button">
                                  Reserve
                              </button>
                              {canRepairVehicle ? (
                                <button onClick={() => handleRepair(vehicle.vehicleId)} className="view-button">
                                    Repair
                                </button>) 
                              : (<></>)}
                              {canDeleteVehicle ? (
                                <button onClick={() => handleDelete(vehicle.vehicleId)} className="reserve-button">
                                    Delete
                                </button>) 
                              : (<></>)}
                            </div>
                          </td>
                      </tr>
                    ): (<></>)
                  ))}
              </tbody>
            </table>) 
          : loading ? (<p>Loading...</p>) 
          : error ? (<p>Error loading vehicles: {error.message}</p>) : (<p>No vehicles found.</p>)}
        </div>
      </p>
      <div className="button-group">
        <button onClick={() => setShowReserve(false)} className='goto-register-button'>Back to Dashboard</button>
        {canAddVehicle && (
        <button onClick={() => setShowAddVehicle(true)} className="reserve-button">
            Add Vehicle
        </button>
        )}
        {canViewAllReservations && (
        <button
            onClick={() => setShowReserve(false)}
            className="view-reservations-button"
        >
            View All Reservations
        </button>
        )}
      </div>
      {message && <p className="profile-message">{message}</p>}
    </div>
  );
}

export default Reserve;
