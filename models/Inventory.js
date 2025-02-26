const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  product: { type: String, required: true },
  location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  quantity: { type: Number, required: true },
  lowStockThreshold: { type: Number, required: true, default: 10 }
});

module.exports = mongoose.model('Inventory', InventorySchema);