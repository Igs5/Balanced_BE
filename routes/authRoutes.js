const express = require('express');
const multer=require("multer")
const { register, login } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

const { uploadProfilePicture,getProfile } = require("../controllers/profilePictureController");
const {household,joinHousehold, createHousehold, searchHouseholds } = require('../controllers/profileController');

const { addItem, getItems, getBoughtItems, buyItem,deleteItem, deleteBoughtItem } = require("../controllers/shoppingController");
const {getBalances}=require("../controllers/balanceController")


const {storage}=require("../config/cloudinary")

const upload = multer({ storage });


router.get('/protected', authMiddleware, (req, res) => {
    res.status(200).json({ message: 'This is a protected route', user: req.userData });
  });
router.post('/register', register);
router.post('/login', login);

// Profile route for the HOUSEHOLD INFO
router.get('/profile', authMiddleware, household);
//Porfile Picture
router.get("/profile-picture",authMiddleware,getProfile)

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


// Integrate the profile picture routes
// router.use('/profile-picture', profilePictureRoutes);
router.post('/profile-picture/upload', authMiddleware, upload.single('profilePicture'), uploadProfilePicture);

module.exports = router;