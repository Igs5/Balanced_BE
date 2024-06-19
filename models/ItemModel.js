const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true },
  household_id: { 
    type: mongoose.Schema.Types.ObjectId, ref: 'Household', required: true },
  status: { 
    type: String, 
    enum: ['pending', 'bought'], 
    default: 'pending' },
  buyer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cost: { type: Number }
});

const Item = mongoose.model('Item', itemSchema);
module.exports= Item;