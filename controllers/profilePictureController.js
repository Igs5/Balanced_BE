const {cloudinary}=require("../config/cloudinary");
const User = require('../models/UserModel');

const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const profilePictureUrl = req.file.path;

    // Fetch the user from the database
    const user = await User.findById(req.user.id);

    // If the user has an existing profile picture, delete it
    if (user.profilePicture) {
      const publicId = user.profilePicture.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }

    // Update the user's profile picture URL
    user.profilePicture = profilePictureUrl;
    
      //  // Mark the 'profilePicture' field as modified
      //  user.markModified('profilePicture');

    await user.save();
    console.log(profilePictureUrl)
    res.json({ profilePicture: profilePictureUrl });
    
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).send('Server error');
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return relevant user data, including profile picture if available
    res.json({
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture || '../assets/default_userImage.png',
      // Add other relevant user data as needed
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { uploadProfilePicture,getProfile };