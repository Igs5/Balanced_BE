const express = require('express');
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const { uploadProfilePicture } = require('../controllers/profilePictureController');
const authMiddleware = require('../middleware/authMiddleware');

const upload = multer({ storage });
const router = express.Router();

router.post('/upload', authMiddleware, upload.single('profilePicture'), uploadProfilePicture);

module.exports = router;