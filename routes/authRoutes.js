const express = require('express');
const { register, login } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

const {household,joinHousehold, createHousehold, searchHouseholds } = require('../controllers/profileController');

const { addItem, getItems, getBoughtItems, buyItem,deleteItem, deleteBoughtItem } = require("../controllers/shoppingController");
const {getBalances}=require("../controllers/balanceController")

const{sendNotification, settleBalance, getNotification}=require("../controllers/notificationController");
const {updateUserDebt,settleDebt}=require("../controllers/userController")

router.get('/protected', authMiddleware, (req, res) => {
    res.status(200).json({ message: 'This is a protected route', user: req.userData });
  });
router.post('/register', register);
router.post('/login', login);

// Profile route
router.get('/profile', authMiddleware, household);


// Household routes
router.get('/households', authMiddleware, searchHouseholds);
router.post('/households/join', authMiddleware, joinHousehold);
router.post('/households/create', authMiddleware, createHousehold);

// Shopping routes
router.post('/shopping/add', authMiddleware, addItem);
router.get('/shopping/items', authMiddleware, getItems);
router.get('/shopping/bought-items', authMiddleware, getBoughtItems);
router.post('/shopping/buy', authMiddleware, buyItem);
router.delete("/shopping/:id",authMiddleware, deleteItem)
router.delete('/shopping/bought/:id', deleteBoughtItem);

//Balance routes
router.get('/balances',authMiddleware, getBalances);

// Fetch detailed balance status
router.get('/balances', authMiddleware, getBalances);


//Notification routes
router.post("/notifications/send",authMiddleware, sendNotification)
router.post("/settle",authMiddleware, settleBalance)
// router.get("/notifications",authMiddleware, getNotification)

//user debbt
router.put("/users/:id/debts", authMiddleware, updateUserDebt)
router.put('/debts/:debtId/settle', authMiddleware, settleDebt);

module.exports = router;