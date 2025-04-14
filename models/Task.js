const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    id: {type: Number, required: true },
    name: {type: String, required: true },
    description: {type: String, required: true },
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'daily' },
    estimatedDuration: {type: Number, required: true },
    price: {type: Number, required: true }
})