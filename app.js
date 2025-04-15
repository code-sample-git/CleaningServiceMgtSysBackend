const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const locationRoutes = require('./routes/locations'); 
const staffRoutes = require('./routes/staffRoutes'); 
const clockRoutes = require('./routes/clock');
const reportRoutes = require('./routes/reports');
const supplyRoutes = require('./routes/supplies');
const proposalRoutes = require('./routes/proposals');
const serviceRoutes = require('./routes/service');
const taskRoutes = require('./routes/tasks');
const feedbackRoutes = require('./routes/feedback');

const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDB();

// Register API routes
app.use('/api/auth', authRoutes);
app.use('/api/locations', locationRoutes); 
app.use('/api/staff', staffRoutes);        
//app.use('/api/clock', clockRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/supplies', supplyRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/service', serviceRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/feedback', feedbackRoutes);

app.get('/', (req, res) => {
  res.send('Service Pro Backend is Running');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many password reset requests, please try again later.',
});

app.use('/api/auth/forgot-password', forgotPasswordLimiter);
