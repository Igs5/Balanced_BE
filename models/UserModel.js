const mongoose = require('mongoose');
const { Schema } = mongoose;


//chat gpt new approach
const userSchema = new mongoose.Schema({
   username: {
       type: String, 
      required: true },
   email: { 
      type: String, 
      required: true, 
      unique: true },
   password: { 
      type: String, 
      required: true },
   profilePicture: { 
      type: String },
   household_id: { 
      type: Schema.Types.ObjectId,
       ref: 'Household' },
   debts: [{
       type: Schema.Types.ObjectId, 
       ref: 'Debt' }]
 });

// //MARIA'S APPROACH

// const debtsSchema = new mongoose.Schema({
//    user: {
//      type: Object,
//      _id: String,
//      username: String,
//    },
//    userOwed: {
//      type: Object,
//      _id: String,
//      username: String,
//    },
//    moneyOwed: Number,
//    payed: {
//      type: Boolean,
//      default: false,
//    },
//    payedConfirmation: {
//      type: Boolean,
//      default: false,
//    },
//  });
 
//  const userSchema = new mongoose.Schema({
//    username: {
//      type: String,
//      required: true,
//    },
//    password: {
//      type: String,
//      required: true,
//    },
//    email: {
//      type: String,
//      required: true,
//    },
//    household_id: {
//      type: mongoose.Schema.Types.ObjectId,
//      ref: 'Household',
//    },
//    balance: {
//      type: Number,
//      default: 0,
//    },
//    debts: {
//      type: [debtsSchema],
//      default: [],
//    },
//  });


// //PREVIOS APPROACH
//    const userSchema = new mongoose.Schema({
//      username: { 
//         type: String,
//          required: true },
//      password: { 
//         type: String, 
//         required: true },
//      email: {
//          type: String,
//         required: true },
//      household_id: {
//          type: mongoose.Schema.Types.ObjectId, ref: 'Household' },
//       balance: { 
//          type: Number, 
//          default: 0 
//           },
//           debts: {
//              type: Map, 
//              of: Number, 
//              default: {} }

   
//       });

   const User = mongoose.model('User', userSchema);

   module.exports = User;