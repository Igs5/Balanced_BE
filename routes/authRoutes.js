const express = require('express');
const { register, login } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { 
  updateDebts,
  markDebtAsPaid,
  confirmDebtPayment,
  getBalances,
  createBoughtItem,
} = require('../controllers/balanceController');
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

const router = express.Router();

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

// Balance routes
router.get('/balances', authMiddleware, getBalances);
router.post('/debts', authMiddleware, updateDebts);
router.put('/debts/:householdId/:debtId/pay', authMiddleware, markDebtAsPaid);
router.put('/debts/:householdId/:debtId/confirm', authMiddleware, confirmDebtPayment);

module.exports = router;



// //FRIDAY ROUTES: 

// const express = require('express');
// const { register, login } = require('../controllers/authController');
// const authMiddleware = require('../middleware/authMiddleware');
// const { updateDebts } = require('../controllers/debtController.js');
// const router = express.Router();
// const { getCurrentUser } = require('../controllers/UsersControllers.js');
// const {
//   household,
//   joinHousehold,
//   createHousehold,
//   searchHouseholds,
//   updateHousehold,
//   updateHouseholdDebts
// } = require('../controllers/profileController');
// const {
//   addItem,
//   getItems,
//   getBoughtItems,
//   buyItem,
//   deleteItem,
//   deleteBoughtItem,
// } = require('../controllers/shoppingController');
// const { getBalances } = require('../controllers/balanceController');

// router.get('/protected', authMiddleware, (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'This is a protected route', user: req.userData });
// });
// router.post('/register', register);
// router.post('/login', login);
// router.get('/me', authMiddleware, getCurrentUser);

// // Profile route
// router.get('/profile', authMiddleware, household);

// // Household routes
// router.get('/households', authMiddleware, searchHouseholds);
// router.post('/households/join', authMiddleware, joinHousehold);
// router.post('/households/create', authMiddleware, createHousehold);
// router.put("/household/:id", authMiddleware, updateHouseholdDebts);

// // Shopping routes
// router.post('/shopping/add', authMiddleware, addItem);
// router.get('/shopping/items', authMiddleware, getItems);
// router.get('/shopping/bought-items', authMiddleware, getBoughtItems);
// router.post('/shopping/buy', authMiddleware, buyItem);
// router.delete('/shopping/:id', authMiddleware, deleteItem);
// router.delete('/shopping/bought/:id', deleteBoughtItem);

// //Balance routes
// router.get('/balances', authMiddleware, getBalances);

// // Fetch detailed balance status
// router.get('/balances', authMiddleware, getBalances);

// //debts
// router.post('/debts', updateDebts);

// router.post('/debts/:debtId/mark-as-paid', authMiddleware, markDebtAsPaid);
// router.post('/debts/:debtId/confirm-payment', authMiddleware, confirmDebtPayment);





// module.exports = router;

// const express = require('express');
// const multer=require("multer")
// const { register, login } = require('../controllers/authController');
// const authMiddleware = require('../middleware/authMiddleware');
// const { updateDebt, postDebts } = require('../controllers/debtController.js');
// const router = express.Router();
// const { getCurrentUser } = require('../controllers/UsersControllers.js');
// const { uploadProfilePicture,getProfile } = require("../controllers/profilePictureController");
// const {household,joinHousehold, createHousehold, searchHouseholds } = require('../controllers/profileController');

// const { addItem, getItems, getBoughtItems, buyItem,deleteItem, deleteBoughtItem } = require("../controllers/shoppingController");
// const {markDebtAsPaid, confirmDebtPayment, updateBalances, getBalances, createBoughtItem}=require("../controllers/balanceController")


// const {storage}=require("../config/cloudinary")

// const upload = multer({ storage });


// router.get('/protected', authMiddleware, (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'This is a protected route', user: req.userData });
// });
// router.post('/register', register);
// router.post('/login', login);
// router.get('/me', authMiddleware, getCurrentUser);

// // Profile route for the HOUSEHOLD INFO
// router.get('/profile', authMiddleware, household);
// //Porfile Picture
// router.get("/profile-picture",authMiddleware,getProfile)

// // Household routes
// router.get('/households', authMiddleware, searchHouseholds);
// router.post('/households/join', authMiddleware, joinHousehold);
// router.post('/households/create', authMiddleware, createHousehold);
// router.put("/household/:id")

// // Shopping routes
// router.post('/shopping/add', authMiddleware, addItem);
// router.get('/shopping/items', authMiddleware, getItems);
// router.get('/shopping/bought-items', authMiddleware, getBoughtItems);
// router.post('/shopping/buy', authMiddleware, buyItem);
// router.delete('/shopping/:id', authMiddleware, deleteItem);
// router.delete('/shopping/bought/:id', deleteBoughtItem);

// //Balance routes
// router.get('/balances', authMiddleware, getBalances);

// router.post('/boughtitem', authMiddleware, createBoughtItem);
// router.post('/markdebtpaid', authMiddleware, markDebtAsPaid);
// router.post('/confirmdebtpayment', authMiddleware, confirmDebtPayment);

// // Integrate the profile picture routes
// // router.use('/profile-picture', profilePictureRoutes);
// router.post('/profile-picture/upload', authMiddleware, upload.single('profilePicture'), uploadProfilePicture);
// //debts
// router.post('/debts', authMiddleware, postDebts);
// router.put('/debts/:id', authMiddleware, postDebts);

// module.exports = router;
