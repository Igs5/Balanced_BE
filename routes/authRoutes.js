const express = require('express');
const { register, login } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

const {household,joinHousehold, createHousehold } = require('../controllers/profileController');





router.get('/protected', authMiddleware, (req, res) => {
    res.status(200).json({ message: 'This is a protected route', user: req.userData });
  });
router.post('/register', register);
router.post('/login', login);

// Profile route
router.get('/profile', authMiddleware, household);


// Household routes
router.post('/households/join', authMiddleware, joinHousehold);
router.post('/households/create', authMiddleware, createHousehold);

module.exports = router;