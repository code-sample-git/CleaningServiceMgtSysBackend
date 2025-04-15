const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    name: {type: String, required: true },
    description: {type: String, required: true },
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'daily' },
    estimatedDuration: {type: Number, required: true },
    price: {type: Number, required: true }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

TaskSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
  
module.exports = mongoose.model('Task', TaskSchema);