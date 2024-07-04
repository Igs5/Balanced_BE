const mongoose = require('mongoose');


 const userSchema = new mongoose.Schema({
   username: {
     type: String,
     required: true,
   },
   password: {
     type: String,
     required: true,
   },
   email: {
     type: String,
     required: true,
   },
   household_id: {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'Household',
   },
   balance: {
     type: Number,
     default: 0,
   },
  
   profilePicture: {
      type: String,
      default: '' 
   }
 });


// //updating user model for PROFILE IMAGE STRING

// const userSchema = new mongoose.Schema({
//    username: { 
//      type: String,
//      required: true 
//    },
//    password: { 
//      type: String, 
//      required: true 
//    },
//    email: {
//      type: String,
//      required: true 
//    },
//    household_id: {
//      type: mongoose.Schema.Types.ObjectId, 
//      ref: 'Household' 
//    },
//    balance: { 
//      type: Number, 
//      default: 0 
//    },
//    debts: {
//      type: Map, 
//      of: Number, 
//      default: {} 
//    },
//    profilePicture: {
//      type: String,
//      default: '' 
//    }
//  });



   // const userSchema = new mongoose.Schema({
   //   username: { 
   //      type: String,
   //       required: true },
   //   password: { 
   //      type: String, 
   //      required: true },
   //   email: {
   //       type: String,
   //      required: true },
   //   household_id: {
   //       type: mongoose.Schema.Types.ObjectId, ref: 'Household' },
   //    balance: { 
   //       type: Number, 
   //       default: 0 
   //        },
   //        debts: {
   //           type: Map, 
   //           of: Number, 
   //           default: {} }

   
   //    });

const User = mongoose.model('User', userSchema);

module.exports = User;
