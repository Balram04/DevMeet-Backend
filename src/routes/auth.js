const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Your user schema
const { signupvalidation } = require("../models/utils/validators");

const authRouter = express.Router();

// Helper function to validate password format
const validatePasswordFormat = (password) => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasMinLength = password.length >= 8;

  const missingRequirements = [];
  if (!hasUpperCase) missingRequirements.push("at least one uppercase letter");
  if (!hasLowerCase) missingRequirements.push("at least one lowercase letter");
  if (!hasNumbers) missingRequirements.push("at least one number");
  if (!hasSpecialChar) missingRequirements.push("at least one special character (!@#$%^&*(),.?\":{}|<>)");
  if (!hasMinLength) missingRequirements.push("minimum 8 characters");

  return {
    isValid: missingRequirements.length === 0,
    missingRequirements
  };
};

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

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ 
        message: "Account not found",
        details: "No account found with this email address. Please check your email or sign up for a new account."
      });
    }

    // Validate password format before comparing
    const passwordValidation = validatePasswordFormat(password);
    if (!passwordValidation.isValid) {
      return res.status(400).send({ 
        message: "Invalid password format",
        details: "Password must include: " + passwordValidation.missingRequirements.join(", "),
        requirements: {
          uppercase: "At least one uppercase letter (A-Z)",
          lowercase: "At least one lowercase letter (a-z)", 
          number: "At least one number (0-9)",
          specialChar: "At least one special character (!@#$%^&*(),.?\":{}|<>)",
          minLength: "Minimum 8 characters"
        }
      });
    }

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ 
        message: "Incorrect password",
        details: "The password you entered is incorrect. Please check your password and try again.",
        hint: "Make sure your password includes: uppercase letter, lowercase letter, number, and special character"
      });
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
