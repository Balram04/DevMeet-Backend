const jwt = require('jsonwebtoken');
const User = require('../models/user');// Corrected file path

const authMiddleware = async (req, res, next) => {
  try {
    console.log('Auth middleware - All cookies:', req.cookies);
    console.log('Auth middleware - Headers:', req.headers.cookie);
    
    const { token } = req.cookies;
    if (!token) {
      console.log('No token found in cookies');
      return res.status(401).send({ message: "Unauthorized: No token provided" });
    }

    console.log('Token found:', token ? 'Yes' : 'No');
    const isvalid = jwt.verify(token, process.env.JWT_SECRET);
    if (!isvalid) {
      console.log('Token verification failed');
      return res.status(401).send({ message: "Unauthorized: Invalid token" });
    }

    console.log("Decoded token:", isvalid);
    const { _id } = isvalid;

    console.log("User ID from token:", _id);
    const user = await User.findById(_id);
    if (!user) {
      console.log('User not found in database');
      return res.status(404).send({ message: "User not found" });
    }

    req.user = user;
    console.log('Auth successful for user:', user.firstname);
    next();
  } catch (error) {
    console.error("Error in auth middleware:", error.message);
    res.status(400).send({ message: "Authentication failed. Please try again." });
  }
};

module.exports = {authMiddleware};