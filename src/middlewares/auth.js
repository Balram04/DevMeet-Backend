const jwt = require('jsonwebtoken');
const User = require('../models/user');// Corrected file path

const authMiddleware = async (req, res, next) => {
  try {
    // Check Authorization header first (for production), then cookies (for local dev)
    let token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      token = req.cookies.token;
    }
    
    console.log('Auth check - Authorization header:', req.headers.authorization ? 'Present' : 'Not present');
    console.log('Auth check - Cookie token:', req.cookies.token ? 'Present' : 'Not present');
    console.log('Auth check - Using token from:', token === req.headers.authorization?.replace('Bearer ', '') ? 'Header' : 'Cookie');
    
    if (!token) {
      console.log('No token found in headers or cookies');
      return res.status(401).send({ message: "Unauthorized: No token provided" });
    }

    const isvalid = jwt.verify(token, process.env.JWT_SECRET);
    if (!isvalid) {
      console.log('Token verification failed');
      return res.status(401).send({ message: "Unauthorized: Invalid token" });
    }

    const { _id } = isvalid;
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