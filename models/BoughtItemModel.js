const mongoose = require('mongoose');

const boughtItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  household_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Household',
    required: true,
  },
});

module.exports = mongoose.model('BoughtItem', boughtItemSchema);