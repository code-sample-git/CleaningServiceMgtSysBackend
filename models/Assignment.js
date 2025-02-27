const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Staff = require('./Staff');
const Location = require('./location');

const Assignment = sequelize.define('Assignment', {
  task_description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  due_date: {
    type: DataTypes.DATE,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Assigned',
  },
});

// Define relationships: An Assignment belongs to both Staff and Location
Assignment.belongsTo(Staff);
Assignment.belongsTo(Location);

module.exports = Assignment;
