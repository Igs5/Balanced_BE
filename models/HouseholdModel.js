const mongoose = require('mongoose');

const householdSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true },
  members: [{
     type: mongoose.Schema.Types.ObjectId,
      ref: 'User' }]
});

const Household = mongoose.model('Household', householdSchema);

module.exports = Household;