const User = require('../models/UserModel.js');

const getCurrentUser = async (req, res) => {
  try {
    const { _id } = req.user;
    const currentUser = await User.findById(_id).populate('household_id');

    if (!currentUser) res.json({ message: 'User not found!' });
    res.json(currentUser);
  } catch (error) {
    res.status(500).json({ message: 'Error getting current user', error });
  }
};

module.exports = { getCurrentUser };g
