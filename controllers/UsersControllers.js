const User = require('../models/UserModel.js');

const getCurrentUser = async (req, res) => {
  try {
    if (req.user.household_id) {
      const currentUser = await User.findById(req.user._id).populate(
        'household_id'
      );
      if (!currentUser) res.json({ message: 'User not found!' });
      return res.status(200).json(currentUser);
    }
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: 'Error getting current user', error });
  }
};

module.exports = { getCurrentUser };
