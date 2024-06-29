const express = require('express');
const router = express.Router();
const Notification=require("../models/NotificationModel");
const Balance=require("../models/BalanceModel");


const sendNotification = async (req, res) => {
    const { senderId, receiverId, message } = req.body;
  
    try {
      const notification = new Notification({
        sender: senderId,
        receiver: receiverId,
        message,
      });
  
      await notification.save();
      res.status(201).json({ message: 'Reminder sent!' });
    } catch (error) {
      res.status(500).json({ message: 'Error sending reminder', error });
    }
  };

  const settleBalance = async (req, res) => {
    const { payeeId, amount } = req.body;
    const payerId = req.user.id; // This is the ID of the user who initiated the request
  
    try {
      // Example: Find the balance entry between the payer and payee
      const balance = await Balance.findOne({ creditor_id: payeeId, debtor_id: payerId });
  
      if (!balance) {
        return res.status(404).json({ message: 'Balance entry not found' });
      }
  
      // Update the balance
      balance.amount -= amount;
      await balance.save();
  
      // Create a notification for the payee
      const notification = new Notification({
        sender: payerId,
        receiver: payeeId,
        message: `Your debt of ${amount} euros has been settled.`,
      });
  
      await notification.save();
  
      res.status(200).json({ message: 'Debt settled!' });
    } catch (error) {
      res.status(500).json({ message: 'Error settling debt', error });
    }
  };

//   const settleBalance= async(req,res)=>{
//     const { payerId, payeeId, amount } = req.body;

//     try {
//       // Find the balance entry between the payer and payee
//       const balance = await Balance.findOne({ creditor_id: payeeId, debtor_id: payerId });
  
//       if (!balance) {
//         return res.status(404).json({ message: 'Balance entry not found' });
//       }
  
//       // Update the balance
//       balance.amount -= amount;
//       await balance.save();
  
//       // Create a notification for the payee
//       const notification = new Notification({
//         sender: payerId,
//         receiver: payeeId,
//         message: `Your debt of ${amount} euros has been settled.`,
//       });
  
//       await notification.save();
  
//       res.status(200).json({ message: 'Debt settled!' });
//     } catch (error) {
//       res.status(500).json({ message: 'Error settling debt', error });
//     }
//   };

//   //fetching notifications for the logged-in user:

//   const getNotification=async(req,res)=>{
//     const userId = req.user.id; // Assuming user id is stored in req.user.id

//   try {
//     const notifications = await Notification.find({ receiver: userId }).sort({ date: -1 });
//     res.status(200).json(notifications);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching notifications', error });
//   }
// };
  

  
  module.exports = {sendNotification,settleBalance}
