const mongoose = require('mongoose');

   const balanceSchema = new mongoose.Schema({
     creditor_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true },
     debtor_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true },
     amount: { 
        type: Number, 
        required: true }
   });

const Balance = mongoose.model('Balance', balanceSchema);

module.exports =Balance;