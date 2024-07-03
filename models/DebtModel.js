const mongoose = require('mongoose');
const { Schema } = mongoose;

const debtSchema = new Schema({
  creditor: { 
    type: Schema.Types.ObjectId,
     ref: 'User', 
     required: true },
  debtor: { 
    type: Schema.Types.ObjectId,
     ref: 'User', 
     required: true },
  amount: {
    type: Number, 
    required: true },
  
  payed: {
     type: Boolean,
      default: false },
  payedConfirmation: { type: Boolean,
     default: false },
     
  createdAt: { type: Date, 
    default: Date.now },
  updatedAt: { type: Date, 
    default: Date.now }
});

const Debt = mongoose.model('Debt', debtSchema);

module.exports = Debt;