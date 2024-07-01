const {cloudinary}=require("../config/cloudinary");
const User = require('../models/UserModel');

const uploadProfilePicture = async (req, res) => {
    try {
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
      await user.save();
  
      res.json({ profilePicture: profilePictureUrl });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  };
  
  module.exports = { uploadProfilePicture };