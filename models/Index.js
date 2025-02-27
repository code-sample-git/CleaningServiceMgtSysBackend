const sequelize = require('../config/database');
const Location = require('./location');
const Staff = require('./Staff');
const Assignment = require('./Assignment');

// Sync all models with the database (creates tables)
sequelize.sync({ force: true }) 
  .then(() => {
    console.log("Database synced successfully!");
  })
  .catch((error) => {
    console.log("Error syncing database:", error);
  });

module.exports = { Location, Staff, Assignment };
