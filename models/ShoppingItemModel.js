const mongoose = require('mongoose');

const shoppingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  household_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Household',
    required: true,
  },
});

module.exports = mongoose.model('ShoppingItem', shoppingItemSchema);