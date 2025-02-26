const Inventory = require('../models/Inventory');

exports.getLowStockAlerts = async (req, res) => {
  try {
    const lowStockItems = await Inventory.find({ quantity: { $lt: 10 } }).populate('location', 'name');
    res.json(lowStockItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};