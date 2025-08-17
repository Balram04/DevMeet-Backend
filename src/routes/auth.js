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

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "4d" });
    
    // For production, send token in response body instead of cookie
    if (process.env.NODE_ENV === 'production') {
      res.status(200).send({ 
        message: "Login successful", 
        user,
        token // Send token to frontend for storage
      });
    } else {
      // For local development, still use cookies
      const cookieOptions = {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 4 * 24 * 60 * 60 * 1000 // 4 days
      };
      
      res.cookie("token", token, cookieOptions);
      res.status(200).send({ message: "Login successful", user });
    }
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).send({ message: "Internal server error" });
  }
});

// ✅ LOGOUT ROUTE
authRouter.post("/logout", (req, res) => {
  try {
    // For local development, clear cookies
    if (process.env.NODE_ENV !== 'production') {
      res.clearCookie("token");
    }
    
    // For production, just send success (frontend will remove token from storage)
    res.status(200).send({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error.message);
    res.status(500).send({ message: "Internal server error" });
  }
});

module.exports = authRouter;
