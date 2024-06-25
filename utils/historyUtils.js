const History = require('../models/HistoryModel');

const addBoughtItemToHistory = async (householdId, newItem) => {
  try {
    // Check if there is a history entry for today
    let history = await History.findOne({
      household_id: householdId,
      timestamp: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lt: new Date().setHours(23, 59, 59, 999)
      }
    });

    // If no history entry for today, create a new one
    if (!history) {
      history = new History({
        household_id: householdId,
        items: [newItem]
      });
    } else {
      // Add the new item to the existing history entry
      history.items.push(newItem);
    }

    await history.save();
  } catch (error) {
    console.error('Error adding bought item to history:', error);
  }
};

module.exports = { addBoughtItemToHistory };