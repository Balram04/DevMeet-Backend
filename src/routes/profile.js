const express = require('express');
const { authMiddleware } = require('../middlewares/auth');
const { validprofiledata } = require('../models/utils/validators');
const upload = require('../../config/multer');
const { uploadToCloudinary, deleteFromCloudinary, extractPublicId } = require('../utils/cloudinaryUtils');
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
    console.log("Received profile edit request:", req.body);
    validprofiledata(req); // Validate profile data

    const loggedInUser = req.user;
    const { firstname, lastname, email, age, gender, about, skills, photoUrl } = req.body;

    // Update only the fields that are provided
    if (firstname !== undefined) loggedInUser.firstname = firstname;
    if (lastname !== undefined) loggedInUser.lastname = lastname;
    if (email !== undefined) loggedInUser.email = email;
    if (age !== undefined) loggedInUser.age = age;
    if (gender !== undefined) loggedInUser.gender = gender;
    if (about !== undefined) loggedInUser.about = about;
    if (skills !== undefined) loggedInUser.skills = skills;
    if (photoUrl !== undefined) loggedInUser.photoUrl = photoUrl;

    console.log("User before save:", loggedInUser);
    await loggedInUser.save(); // Save updated user
    console.log("User after save:", loggedInUser);
    
    res.status(200).send({
      message: `${loggedInUser.firstname}, your profile updated successfully!`, 
      user: loggedInUser 
    });
  } catch (error) {
    console.error("Error occurred:", error.message);
    console.error("Full error:", error);
    res.status(400).send({ message: error.message });
  }
});

// New route for uploading profile photo
proRouter.post("/profile/upload-photo", authMiddleware, upload.single('photo'), async (req, res) => {
  try {
    console.log('Upload photo endpoint hit');
    console.log('File received:', req.file ? 'Yes' : 'No');
    console.log('User:', req.user ? req.user.firstname : 'No user');

    if (!req.file) {
      console.log('No file in request');
      return res.status(400).send({ message: "No file uploaded" });
    }

    const loggedInUser = req.user;
    
    // Delete old photo from Cloudinary if exists
    if (loggedInUser.photoUrl) {
      try {
        const oldPublicId = extractPublicId(loggedInUser.photoUrl);
        if (oldPublicId) {
          console.log('Deleting old photo:', oldPublicId);
          await deleteFromCloudinary(oldPublicId);
        }
      } catch (deleteError) {
        console.log("Error deleting old photo:", deleteError.message);
        // Continue with upload even if deletion fails
      }
    }

    // Upload new photo to Cloudinary
    console.log('Uploading to Cloudinary...');
    const cloudinaryUrl = await uploadToCloudinary(req.file.buffer);
    console.log('Upload successful:', cloudinaryUrl);
    
    // Update user's photo URL
    loggedInUser.photoUrl = cloudinaryUrl;
    await loggedInUser.save();

    res.status(200).send({
      message: "Photo uploaded successfully!",
      photoUrl: cloudinaryUrl,
      user: loggedInUser
    });

  } catch (error) {
    console.error("Error uploading photo:", error);
    res.status(500).send({ 
      message: "Failed to upload photo", 
      error: error.message 
    });
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
