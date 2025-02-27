const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
//const locationRoutes = require('./routes/locations');
const clockRoutes = require('./routes/clock');
const reportRoutes = require('./routes/reports');
const supplyRoutes = require('./routes/supplies');
const proposalRoutes = require('./routes/proposals');
//const staffRoutes = require('./routes/staff');

dotenv.config();
// Initialize Express app
const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();


// Register API routes
app.use('/api/auth', authRoutes);
//app.use('/api/locations', locationRoutes);
//app.use('/api/clock', clockRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/supplies', supplyRoutes);
//app.use('/api/proposals', proposalRoutes);
//app.use('/api/staff', staffRoutes);

// Default route to check if server is up
app.get('/', (req, res) => {
  res.send('Service Pro Backend is Running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error', error: err.message });
});

// Set up the server to listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});