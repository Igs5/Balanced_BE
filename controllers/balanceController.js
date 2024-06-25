const User = require("../models/UserModel");
const Household = require("../models/HouseholdModel");
const BoughtItem = require("../models/BoughtItemModel");
const { addBoughtItemToHistory } = require("../utils/historyUtils")

const updateBalances = async (householdId) => {
  try {
    const household = await Household.findById(householdId).populate('members');
    const members = household.members;

    // Initialize balance map
    const balanceMap = {};
    members.forEach(member => {
      balanceMap[member._id] = 0; // Initialize each member's balance
    });

    // Fetch all bought items for the household
    const boughtItems = await BoughtItem.find({ household_id: householdId }).populate('buyer', 'username');

    // Calculate total cost
    const totalCost = boughtItems.reduce((acc, item) => acc + item.cost, 0);

    // Calculate each member's share of the total cost
    const memberCount = members.length;
    const sharePerMember = totalCost / memberCount;

    // Calculate how much each member has paid
    const payments = {};
    members.forEach(member => {
      payments[member._id] = 0;
    });

    boughtItems.forEach(item => {
      payments[item.buyer._id] += item.cost;
    });

    // Calculate balance for each member
    members.forEach(member => {
      balanceMap[member._id] = payments[member._id] - sharePerMember;
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

const createBoughtItem = async (req, res) => {
  const { name, cost, buyer } = req.body;
  const householdId = req.user.household_id;

  try {
    const newItem = new BoughtItem({
      name,
      cost,
      buyer,
      household_id: householdId
    });
    console.log(newItem);
    await newItem.save();
    await addBoughtItemToHistory(householdId, newItem);

    // Update balances after adding the new bought item
    await updateBalances(householdId);

    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating bought item:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { updateBalances, getBalances, createBoughtItem };


// const User = require("../models/UserModel");
// const Household = require("../models/HouseholdModel");
// const History = require("../models/HistoryModel");

// const updateBalances = async (householdId) => {
//   try {
//     const household = await Household.findById(householdId).populate('members');
//     const members = household.members;

//     // Initialize balance map
//     const balanceMap = {};
//     members.forEach(member => {
//       balanceMap[member._id] = 0; // Initialize each member's balance
//     });

//     // Fetch all history entries for the household
//     const histories = await History.find({ household_id: householdId }).populate('items.buyer');

//     // Calculate balances
//     histories.forEach(history => {
//       history.items.forEach(item => {
//         balanceMap[item.buyer._id] -= item.cost; // Deduct cost from buyer's balance
//         const share = item.cost / members.length;
//         members.forEach(member => {
//           if (member._id.toString() !== item.buyer._id.toString()) {
//             balanceMap[member._id] += share; // Add share of cost to each member's balance
//           }
//         });
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

// module.exports = { updateBalances, getBalances };


