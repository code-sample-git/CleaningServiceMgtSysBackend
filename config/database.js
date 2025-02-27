const { Sequelize } = require('sequelize');

// Configure Sequelize to connect to your PostgreSQL database
const sequelize = new Sequelize(
  process.env.DATABASE_URL || 'postgres://postgres:servicepro@localhost:5432/service_pro', 
  {
    dialect: 'postgres',
    logging: false,  
  }
);

module.exports = sequelize;
