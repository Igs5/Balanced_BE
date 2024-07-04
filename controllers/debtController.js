const Debt = require('../models/DebtsInfoModel.js');
const User = require('../models/UserModel.js');

const postDebts = async (req, res) => {
  try {
    const { debts, userId, } = req.body;
    const user = 
    console.log(debts);

    const debtsCreated = await Debt.insertMany(req.body);
    console.log(debtsCreated);
    res.json(debtsCreated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user debt', error });
  }
};
const updateDebt = async (req, res) => {
  try {
    const { debt } = req.body;
    const findDebt = await Debt.findById(req.params.id);

    if (!findDebt) {
      return res.status(404).json({ message: 'Debt not found' });
    }

    const debtUpdated = await Debt.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(debtUpdated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user debt', error });
  }
};

module.exports = { updateDebt, postDebts };
