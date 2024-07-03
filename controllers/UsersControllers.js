const User = require('../models/UserModel.js');
const updateUserDebt = async (req, res) => {
  try {
    const { debts } = req.body;
    // console.log(JSON.stringify(req.body, null, 2));
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userDebtUpdated = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(userDebtUpdated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user debt', error });
  }
};

module.exports = { updateUserDebt };
