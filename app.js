const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const locationRoutes = require('./routes/locations');
const clockRoutes = require('./routes/clock');
const reportRoutes = require('./routes/reports');
const supplyRoutes = require('./routes/supplies');
const proposalRoutes = require('./routes/proposals');

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB (adjust URI as needed)
mongoose.connect('mongodb://localhost:27017/servicepro', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Register API routes
app.use('/api/auth', authRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/clock', clockRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/supplies', supplyRoutes);
app.use('/api/proposals', proposalRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
