const express = require('express');
const { register, login } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const User = require("../models/UserModel");

// const { newPost,getPost } = require('../controllers/postsController');



router.get('/protected', authMiddleware, (req, res) => {
    res.status(200).json({ message: 'This is a protected route', user: req.userData });
  });
router.post('/register', register);
router.post('/login', login);


module.exports = router;