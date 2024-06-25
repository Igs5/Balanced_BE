const User = require("../models/UserModel");
const Household = require("../models/HouseholdModel");
const History = require("../models/HistoryModel");

const updateBalances = async (householdId) => {
  try {
    const household = await Household.findById(householdId).populate('members');
    const members = household.members;

    // Initialize balance map
    const balanceMap = {};
    members.forEach(member => {
      balanceMap[member._id] = 0; // Initialize each member's balance
    });

    // Fetch all history entries for the household
    const histories = await History.find({ household_id: householdId }).populate('items.buyer');

    // Calculate balances
    histories.forEach(history => {
      history.items.forEach(item => {
        balanceMap[item.buyer._id] -= item.cost; // Deduct cost from buyer's balance
        const share = item.cost / members.length;
        members.forEach(member => {
          if (member._id.toString() !== item.buyer._id.toString()) {
            balanceMap[member._id] += share; // Add share of cost to each member's balance
          }
        });
      });
    });

    // Update each member's balance
    await Promise.all(members.map(async member => {
      member.balance = balanceMap[member._id];
      await member.save();
    }));

  } catch (error) {
    console.error('Error updating balances:', error);
  }
};

const getBalances = async (req, res) => {
  try {
    const householdId = req.user.household_id;
    const users = await User.find({ household_id: householdId }, 'username balance');
    res.json(users);
  } catch (error) {
    console.error('Error fetching balances:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { updateBalances, getBalances };


// const User = require("../models/UserModel");
// const Household =require("../models/HouseholdModel");
// const History =require("../models/HistoryModel");
// const BoughtItem=require("../models/BoughtItemModel");


// const updateBalances = async (householdId) => {
//   try {
//     const household = await Household.findById(householdId).populate('members');
//     const members = household.members;

//     // Initialize balance map
//     const balanceMap = {};
//     members.forEach(member => {
//       balanceMap[member._id] = 0; // Initialize each member's balance
//     });

//     // Fetch all bought items for the household
//     const boughtItems = await BoughtItem.find({ household_id: householdId }).populate('buyer', 'username');

//     // Calculate balances
//     boughtItems.forEach(item => {
//       balanceMap[item.buyer._id] -= item.cost; // Deduct cost from buyer's balance
//       item.items.forEach(i => {
//         balanceMap[i.buyer] += i.cost; // Add share of cost to each buyer's balance
//       });
//     });

//     // Update each member's balance
//     await Promise.all(members.map(async member => {
//       member.balance = balanceMap[member._id];
//       await member.save();
//     }));

//   } catch (error) {
//     console.error('Error updating balances:', error);
//   }
// };

// const getBalances = async (req, res) => {
//   try {
//     const householdId = req.user.household_id;
//     const users = await User.find({ household_id: householdId }, 'username balance');
//     res.json(users);
//   } catch (error) {
//     console.error('Error fetching balances:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

//   module.exports={updateBalances, getBalances}