const mongoose = require('mongoose');

// const ItemsSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   cost: {
//     type: Number,
//     required: true,
//     default: 0,
//   },
//   buyer: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//     default: '',
//   },
// });

const DebtsSchema = new mongoose.Schema({
  householdMember1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  householdMember2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  moneyToPay: {
    type: Number,
    default: 0,
  },
  moneyToReceive: {
    type: Number,
    default: 0,
  },
  payed: {
    type: Boolean,
    default: false,
  },
  payedConfirmation: {
    type: Boolean,
    default: false,
  },
});


const householdSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  debts: [DebtsSchema],
  // items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BoughtItem' }],
});

module.exports = mongoose.model('Household', householdSchema);
