//home profile section. USER'S HOUSEHOLD
const User = require('../models/UserModel.js');
const Household = require('../models/HouseholdModel.js');

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

module.exports = {
  household,
  joinHousehold,
  createHousehold,
  searchHouseholds,
  updateHousehold
};
