const mongoose = require('mongoose');

const debtSchema = new mongoose.Schema({
    user: {
      type: Object,
      _id: String,
      username: String,
    },
    userOwed: {
      type: Object,
      _id: String,
      username: String,
    },
    moneyOwed: Number,
    payed: {
      type: Boolean,
      default: false,
    },
    payedConfirmation: {
      type: Boolean,
      default: false,
    },
  }, {collection: "debts"});

  const DebtsInfo = mongoose.model('DebtsInfo', debtsSchema);

module.exports = Debt;