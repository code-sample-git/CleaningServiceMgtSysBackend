const dotenv = require('dotenv');
const express = require('express');
const { Sequelize } = require('sequelize');
const cors = require('cors');  
const bodyParser = require('body-parser');
const Location = require('./models/location'); 
dotenv.config();

// Initialize Express app
const app = express();

// Middleware setup
app.use(cors());
app.use(express.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

// Initialize Sequelize connection
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false, 
});

// Test database connection
sequelize.authenticate()
    .then(() => console.log('Database connected successfully!'))
    .catch(err => console.log('Unable to connect to the database:', err));

// Import routes
const locationRoutes = require('./routes/locations'); 
const staffRoutes = require('./routes/staff'); 

// Use routes
app.use('/api/locations', locationRoutes);  
app.use('/api/staff', staffRoutes); 

// Default route to check if server is up
app.get('/', (req, res) => {
    res.send('Service Pro Backend is Running');
});

// Set up the server to listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
