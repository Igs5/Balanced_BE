//This will check if the request has a valid token
require('dotenv').config();
const User = require('../models/UserModel');

const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;
  console.log(authorization);
  if (!authorization) {
    return res.status(401).json({ error: 'Not Authorized' });
  }
  const token = authorization.split(' ')[1];
  console.log(token);

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decodedToken);

    const user = await User.findById(decodedToken.user.id);
    if (!user) {
      throw new Error('User not found');
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

module.exports = authMiddleware;
