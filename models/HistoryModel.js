const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: String,
  cost: Number,
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const historySchema = new mongoose.Schema({
  household_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Household',
    required: true
  },
  items: [itemSchema],
  totalCost: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Calculate total cost before saving
historySchema.pre('save', function (next) {
  this.totalCost = this.items.reduce((acc, item) => acc + item.cost, 0);
  next();
});

module.exports = mongoose.model('History', historySchema);