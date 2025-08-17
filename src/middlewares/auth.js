const jwt = require('jsonwebtoken');
const User = require('../models/user');// Corrected file path

const authMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send({ message: "Unauthorized: No token provided" });
    }

    const isvalid = jwt.verify(token, process.env.JWT_SECRET); // Use env variable for secret
    if (!isvalid) {
      return res.status(401).send({ message: "Unauthorized: Invalid token" });
    }

    console.log("Decoded token:", isvalid);
    const { _id } = isvalid;

    console.log("User ID from token:", _id);
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in auth middleware:", error.message);
    res.status(400).send({ message: "Authentication failed. Please try again." });
  }
};

module.exports = {authMiddleware};