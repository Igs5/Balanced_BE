//home profile section. USER'S HOUSEHOLD
const User = require('../models/UserModel.js');
const Household = require('../models/HouseholdModel.js');
const BoughtItem = require('../models/BoughtItemModel.js');

// Function to get the user's household info
const household = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('household_id');
    console.log(user);
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
    const { id } = req.params;
    const { newDebts, debt } = req.body;

    const householdFound = await Household.findById(id);

    const HouseholdMember1 = await User.findById(
      debt.householdMember1
    ).populate('household_id');

    const HouseholdMember2 = await User.findById(
      debt.householdMember2
    ).populate('household_id');

    if (!HouseholdMember1 || !HouseholdMember2)
      res.status(404).json({ message: 'No users were found for this debt.' });

    if (!householdFound)
      res.status(404).json({ message: 'Household not found!' });

    if (debt.payedConfirmation) {
      if (debt.moneyToPay) {
        console.log(debt.moneyToPay);
        console.log(HouseholdMember1.balance);
        console.log(HouseholdMember2.balance);
        HouseholdMember1.balance += debt.moneyToPay;
        console.log(HouseholdMember1.balance);
        HouseholdMember2.balance -= debt.moneyToPay;
        console.log(HouseholdMember2.balance);
      } else {
        HouseholdMember1.balance -= debt.moneyToReceive;
        HouseholdMember2.balance += debt.moneyToReceive;
      }

      await HouseholdMember1.save();
      await HouseholdMember2.save();
      const itemsMember1 = await BoughtItem.find({
        buyer: HouseholdMember1._id,
      });
      const itemsMember2 = await BoughtItem.find({
        buyer: HouseholdMember2._id,
      });
      let itemsToDelete;
      if (debt.moneyToPay) {
        itemsToDelete = itemsMember1;

        let cost = debt.moneyToPay;
        itemsMember2.map((item) => {
          if (cost - item.cost > 0 || cost - item.cost === 0) {
            cost - item.cost;
            itemsToDelete.push(item._id);
          }
        });
      } else {
        itemsToDelete = itemsMember2;
        let cost = debt.moneyToReceive;
        itemsMember1.map((item) => {
          if (cost - item.cost > 0 || cost - item.cost === 0) {
            cost -= item.cost;
            itemsToDelete.push(item._id);
          }
        });
      }
      console.log(itemsToDelete);
      await BoughtItem.deleteMany({ _id: { $in: itemsToDelete } });
      debt.moneyToPay = 0;
      debt.moneyToReceive = 0;
    }

    newDebts.push(debt);
    householdFound.debts = newDebts;
    await householdFound.save();

    req.user.id === HouseholdMember1._id
      ? res.status(200).json(HouseholdMember1)
      : res.status(200).json(HouseholdMember1);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateHouseholdDebts = async (req, res) => {
  try {
    const { id } = req.params;
    const users = await User.find({ household_id: id });
    const household = await Household.findById({ _id: id }).populate('members');
    const debtors = users.filter((user) => user.balance < 0);
    const creditors = users.filter((user) => user.balance > 0);

    const debts = [];
    debtors.length > 0 &&
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

    if (!household) res.status(404).json({ message: 'Household not found!' });

    household.debts.map((oldDebt) => {
      debts.length > 0 &&
        debts.map((newDebt) => {
          if (!oldDebt.payed) {
            if (
              oldDebt.householdMember1.toHexString() == newDebt.debtor._id &&
              oldDebt.householdMember2.toHexString() == newDebt.creditor._id
            ) {
              oldDebt.moneyToPay = newDebt.moneyToPay;
              oldDebt.moneyToReceive = newDebt.moneyToReceive;
            } else if (
              oldDebt.householdMember2.toHexString() == newDebt.debtor._id &&
              oldDebt.householdMember1.toHexString() == newDebt.creditor._id
            ) {
              oldDebt.moneyToPay = newDebt.moneyToReceive;
              oldDebt.moneyToReceive = newDebt.moneyToPay;
            }
          }
        });

      if (oldDebt.payedConfirmation) {
        oldDebt.payed = false;
        oldDebt.payedConfirmation = false;
      }
    });
    await household.save();
    const updatedDebts = household.debts;
    console.log(updatedDebts);
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
