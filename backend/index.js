require('dotenv').config({ path: require('path').resolve(__dirname, './.env') });
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const reimbursementRoutes = require('./routes/reimbursementRoutes');

const app = express();

const allowedOrigins = [
  'http://localhost:3000', // Local development
  process.env.REACT_APP_FRONTEND_URL, // Frontend hosted URL
];
app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(express.json()); // Parse incoming JSON data

app.use('/api/auth', authRoutes);
app.use('/api/vehicle', vehicleRoutes);
app.use('/api/reservation', reservationRoutes);
app.use('/api/reimbursements', reimbursementRoutes);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
