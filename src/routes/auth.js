const express =require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require('../models/user'); // Corrected file path
const {signupvalidation} = require("../models/utils/validators");

const  authRouter=express.Router();

authRouter.post("/signup",async (req, res) => {
  try {
    signupvalidation(req);
    const { firstname, lastname, email, password,skills ,PhotoUrl} = req.body;

    const pswrdhashed = await bcrypt.hash(password, 10);

    const user = new User({
      firstname,
      lastname,
      email,
      skills,
      PhotoUrl,
      password: pswrdhashed, // Hash the password before saving
    });

    // Save the user to the database
    await user.save();
    res.status(201).send(user); // Send the created user as a response
  } catch (error) {
    console.error("Error in /signup route:", error.message);
    res.status(400).send({ message: "Error occurred during signup. Please try again." });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).send({ message: "Invalid email or password" });
    }
    
     const pswrdisMatch = await bcrypt.compare(password, user.password);
    if (!pswrdisMatch) {
      return res.status(400).send({ message: "Invalid email or password" });
    }

    const token = await jwt.sign({_id:user._id},'ramlal@123' ,{expiresIn:'4d'});
    res.cookie("token", token);
    res.status(200).send({ message: "Login successful by", user });
  } catch (error) {
    console.error("Error occurred:", error.message);
    res.status(500).send({ message: "Internal server issue!" });
  }
});

authRouter.post('/logout',async (req, res) => {
  try {
    res.clearCookie("token",null ,{expires:new Date(Date.now())});
    res.status(200).send({ message: "Logout successful" });
    
  } catch (error) {
    console.error("Error occurred:", error.message);
    res.status(500).send({ message: "Internal server issue!" });
  }
});

module.exports = authRouter;