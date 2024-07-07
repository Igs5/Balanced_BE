//home profile section. USER'S HOUSEHOLD
const User = require('../models/UserModel.js');
const Household = require('../models/HouseholdModel.js');

//FRIDAY VERSION: 
// Function to get the user's household info
const household = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('household_id');
    if (!user.household_id) {
      return res.status(404).json({ message: 'User has no household' });
    }
    res.json({ household: user.household_id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const joinHousehold = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if user is already assigned to a household
    const user = await User.findById(req.user.id);
    if (user.household_id) {
      return res
        .status(400)
        .json({ message: 'User is already assigned to a household' });
    }

    // Find the household by name
    const household = await Household.findOne({ name });
    if (!household) {
      return res.status(404).json({ message: 'Household not found' });
    }

    // Update the user's household_id and add user to household members
    user.household_id = household._id;
    household.members.push(user._id);
    const debts = household.members
      .filter((member) => member._id !== user._id)
      .map((member) => {
        const debtObject = {
          householdMember1: user._id,
          householdMember2: member._id,
        };
        return debtObject;
      });
    household.debts = debts;
    await Promise.all([user.save(), household.save()]);

    res.json({ message: 'Joined household', household });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// CREATE a new household
const createHousehold = async (req, res) => {
  try {
    const { name } = req.body;

    // Create a new household
    const household = new Household({
      name,
      owner: req.user.id,
      members: [req.user.id],
    });
    await household.save();

    // Update the user's household_id
    const user = await User.findById(req.user.id);
    user.household_id = household._id;
    await user.save();

    res.json({ message: 'Household created', household });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//SEARCH Households
const searchHouseholds = async (req, res) => {
  try {
    const { search } = req.query;
    const households = await Household.find({
      name: { $regex: search, $options: 'i' },
    }); // Case-insensitive search
    res.json(households);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateHousehold = async (req, res) => {
  try {
    const { household } = req.body;
    const householdFound = await findById(household.household_id);
    if (!householdFound)
      res.status(404).json({ message: 'Household not found!' });
    const updatedHousehold = await findByIdAndUpdate(
      Household.household_id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedHousehold);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateHouseholdDebts = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const users = await User.find({ household_id: id });
    const household = await Household.findById({ _id: id }).populate('members');
    const debtors = users.filter((user) => user.balance < 0);
    const creditors = users.filter((user) => user.balance > 0);
    // console.log(debtors, creditors);
    const debts = [];
    debtors.map((debtor) => {
      creditors.map((creditor) => {
        const debt = {
          debtor,
          creditor,
          moneyToPay: Math.min(-debtor.balance, creditor.balance),
          moneyToReceive: 0,
        };
        debts.push(debt);
      });
    });
    if (!debts.length) res.status(404).json({ message: 'Debt not found!' });
    // console.log("New debts", debts);
    if (!household) res.status(404).json({ message: 'Household not found!' });
    // console.log('Debts', household.debts);
    household.debts.map((oldDebt) => {
      // console.log('oldDebt', oldDebt);
      debts.map((newDebt) => {
        // console.log('NewDebt', newDebt);
        console.log(oldDebt.householdMember1.toHexString());
        if (
          oldDebt.householdMember1.toHexString() == newDebt.debtor._id &&
          oldDebt.householdMember2.toHexString() == newDebt.creditor._id
        ) {
          oldDebt.moneyToPay = newDebt.moneyToPay;
          console.log(oldDebt.moneyToPay);
          oldDebt.moneyToReceive = newDebt.moneyToReceive;
        } else if (
          oldDebt.householdMember2.toHexString() == newDebt.debtor._id &&
          oldDebt.householdMember1.toHexString() == newDebt.creditor._id
        ) {
          oldDebt.moneyToPay = newDebt.moneyToReceive;
          oldDebt.moneyToReceive = newDebt.moneyToPay;
        }
      });
    });
    await household.save();
    const updatedDebts = household.debts;
    res.status(200).json(updatedDebts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  household,
  joinHousehold,
  createHousehold,
  searchHouseholds,
  updateHousehold,
  updateHouseholdDebts,
};


// // Function to get the user's household info
// const household = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).populate('household_id');
//     if (!user.household_id) {
//       return res.status(404).json({ message: 'User has no household' });
//     }
//     res.json({ household: user.household_id });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// const joinHousehold = async (req, res) => {
//   try {
//     const { name } = req.body;

//     // Check if user is already assigned to a household
//     const user = await User.findById(req.user.id);
//     if (user.household_id) {
//       return res
//         .status(400)
//         .json({ message: 'User is already assigned to a household' });
//     }

//     // Find the household by name
//     const household = await Household.findOne({ name });
//     if (!household) {
//       return res.status(404).json({ message: 'Household not found' });
//     }

//     // Update the user's household_id and add user to household members
//     user.household_id = household._id;
//     household.members.push(user._id);
//     const debts = household.members
//       .filter((member) => member._id !== user._id)
//       .map((member) => {
//         const debtObject = {
//           householdMember1: user._id,
//           householdMember2: member._id,
//         };
//         return debtObject;
//       });
//     household.debts = debts;
//     await Promise.all([user.save(), household.save()]);

//     res.json({ message: 'Joined household', household });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // CREATE a new household
// const createHousehold = async (req, res) => {
//   try {
//     const { name } = req.body;

//     // Create a new household
//     const household = new Household({
//       name,
//       owner: req.user.id,
//       members: [req.user.id],
//     });
//     await household.save();

//     // Update the user's household_id
//     const user = await User.findById(req.user.id);
//     user.household_id = household._id;
//     await user.save();

//     res.json({ message: 'Household created', household });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// //SEARCH Households
// const searchHouseholds = async (req, res) => {
//   try {
//     const { search } = req.query;
//     const households = await Household.find({
//       name: { $regex: search, $options: 'i' },
//     }); // Case-insensitive search
//     res.json(households);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


// const updateHousehold = async (req, res) => {
//   try {
//     const { household } = req.body;
//     const householdFound = await findById(household.household_id);
//     if (!householdFound)
//       res.status(404).json({ message: 'Household not found!' });
//     const updatedHousehold = await findByIdAndUpdate(
//       Household.household_id,
//       req.body,
//       { new: true }
//     );
//     res.status(200).json(updatedHousehold);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = {
//   household,
//   joinHousehold,
//   createHousehold,
//   searchHouseholds,
//   updateHousehold
// };
