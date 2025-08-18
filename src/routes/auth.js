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
  if (!hasUpperCase) missingRequirements.push("uppercase letter (A-Z)");
  if (!hasLowerCase) missingRequirements.push("lowercase letter (a-z)");
  if (!hasNumbers) missingRequirements.push("number (0-9)");
  if (!hasSpecialChar) missingRequirements.push("special character (!@#$%^&*)");
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
        message: "Account not found! 📧",
        toast: "No account found with this email. Please check your email or sign up!",
        details: "The email address is not registered in our system"
      });
    }

    // Validate password format before comparing
    const passwordValidation = validatePasswordFormat(password);
    if (!passwordValidation.isValid) {
      return res.status(400).send({ 
        message: "Password format is incorrect! 🔒",
        toast: `Password must include: ${passwordValidation.missingRequirements.join(", ")}`,
        details: "Please ensure your password meets all requirements",
        requirements: passwordValidation.missingRequirements
      });
    }

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ 
        message: "Password is incorrect! ❌",
        toast: "Wrong password. Make sure it includes: uppercase, lowercase, number & special character",
        details: "The password you entered doesn't match our records"
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
