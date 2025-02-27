const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Location = require('./location');

const Staff = sequelize.define('Staff', {
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  position: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  clocked_in: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

// Define the relationship between Staff and Location (a staff member belongs to a location)
Staff.belongsTo(Location); 

module.exports = Staff;
