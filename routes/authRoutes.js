const express = require('express');
const { register, login } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { updateDebts } = require('../controllers/debtController.js');
const router = express.Router();
const { getCurrentUser } = require('../controllers/UsersControllers.js');
const {
  household,
  joinHousehold,
  createHousehold,
  searchHouseholds,
  updateHousehold,
  updateHouseholdDebts
} = require('../controllers/profileController');
const {
  addItem,
  getItems,
  getBoughtItems,
  buyItem,
  deleteItem,
  deleteBoughtItem,
} = require('../controllers/shoppingController');
const { getBalances } = require('../controllers/balanceController');

router.get('/protected', authMiddleware, (req, res) => {
  res
    .status(200)
    .json({ message: 'This is a protected route', user: req.userData });
});
router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getCurrentUser);

// Profile route
router.get('/profile', authMiddleware, household);

// Household routes
router.get('/households', authMiddleware, searchHouseholds);
router.post('/households/join', authMiddleware, joinHousehold);
router.post('/households/create', authMiddleware, createHousehold);
router.put("/household/:id", authMiddleware, updateHouseholdDebts);

// Shopping routes
router.post('/shopping/add', authMiddleware, addItem);
router.get('/shopping/items', authMiddleware, getItems);
router.get('/shopping/bought-items', authMiddleware, getBoughtItems);
router.post('/shopping/buy', authMiddleware, buyItem);
router.delete('/shopping/:id', authMiddleware, deleteItem);
router.delete('/shopping/bought/:id', deleteBoughtItem);

//Balance routes
router.get('/balances', authMiddleware, getBalances);

// Fetch detailed balance status
router.get('/balances', authMiddleware, getBalances);

//debts
router.post('/debts', updateDebts);

module.exports = router;
