const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  sender: { 
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true },

  receiver: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true },

  message: { 
    type: String, 
    required: true },

  date: { type: Date, 
    default: Date.now },

  read: { type: Boolean, 
    default: false }
    
});

module.exports = mongoose.model('Notification', NotificationSchema);