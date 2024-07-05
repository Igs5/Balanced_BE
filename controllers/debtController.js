const Household = require('../models/HouseholdModel.js');
const User = require('../models/UserModel.js');

const updateDebts = async (req, res) => {
  try {
    const { household_id } = req.body;
    const users = await User.find({ household_id });
    const household = await Household.findById({ _id: household_id }).populate(
      'members'
    );
    const debtors = users.filter((user) => user.balance < 0);
    const creditors = users.filter((user) => user.balance > 0);
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

module.exports = { updateDebts };
