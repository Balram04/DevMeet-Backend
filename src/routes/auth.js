const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Your user schema
const { signupvalidation } = require("../models/utils/validators");

const authRouter = express.Router();

// ✅ SIGNUP ROUTE
authRouter.post("/signup", async (req, res) => {
  try {
    signupvalidation(req);

    const {
      firstname,
      lastname,
      email,
      password,
      phone,
      age,
      gender,
      about,
      skills,
      photoUrl
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      phone,
      age,
      gender,
      about,
      skills,
      photoUrl
    });

    await user.save(); //to save data into Db
    res.status(201).send({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Error in /signup route:", error.message);
    res.status(400).send({ message: "Signup failed. Please check details and try again." });
  }
});

// ✅ LOGIN ROUTE
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ _id: user._id }, "ramlal@123", { expiresIn: "4d" });
    res.cookie("token", token);
    res.status(200).send({ message: "Login successful", user });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).send({ message: "Internal server error" });
  }
});

// ✅ LOGOUT ROUTE
authRouter.post("/logout", (req, res) => {
  try {
    res.clearCookie("token", null, { expires: new Date(Date.now()) });
    res.status(200).send({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error.message);
    res.status(500).send({ message: "Internal server error" });
  }
});

module.exports = authRouter;
