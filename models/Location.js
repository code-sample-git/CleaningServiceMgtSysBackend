// models/location.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Location = sequelize.define('Location', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Pending',
  },
});

module.exports = Location;
