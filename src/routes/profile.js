const express = require('express');
const { authMiddleware } = require('../middlewares/auth');
const { validprofiledata } = require('../models/utils/validators');
const proRouter = express.Router();
const bcrypt = require('bcrypt'); // Import bcrypt

proRouter.use(express.json());

proRouter.get("/profile/view", authMiddleware, async (req, res) => {
  try {
    const user = req.user; // Access the user from the request object
    if (!user) {
      return res.status(401).send({ message: "User not found" });
    }

    res.status(200).send(user);
  } catch (error) {
    console.error("Error occurred:", error.message);
    res.status(500).send({ message: "Internal server issue!" });
  }
});

proRouter.patch("/profile/edit", authMiddleware, async (req, res) => {
  try {
    validprofiledata(req); // Validate profile data

    const loggedInUser = req.user;

    // Update user fields
   Object.keys(req.body).forEach((key) => {
  if (req.body[key] !== undefined && req.body[key] !== null) {
    loggedInUser[key] = req.body[key];
  }
    });

    await loggedInUser.save(); // Save updated user
    res.status(200).send({
      message: `${loggedInUser.firstname}, your Profile updated successfully`, 
       user: loggedInUser });
  } catch (error) {
    console.error("Error occurred:", error.message);
    res.status(400).send({ message: error.message });
  }
});

proRouter.patch("/profile/password", authMiddleware, async (req, res) => {
  try {
    const { password, newpassword } = req.body;
    if (!password || !newpassword) {
  return res.status(400).send({ message: "Both current and new password are required." });
}


    const loggedInUser = req.user;

    // Check if the old password matches
    const isMatch = await bcrypt.compare(password, loggedInUser.password);
    if (!isMatch) {
      return res.status(400).send({ message: "Old password is incorrect" });
    }

    // Hash the new password and update it
    const hashedNewPassword = await bcrypt.hash(newpassword, 10);
    loggedInUser.password = hashedNewPassword;

    await loggedInUser.save(); // Save updated user
    res.status(200).send({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error occurred:", error.message);
    res.status(400).send({ message: error.message });
  }
});
  

module.exports = proRouter;
