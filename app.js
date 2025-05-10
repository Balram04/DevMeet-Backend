const express = require('express');
const connectDb = require('./config/db');
const app = express();
const bcrypt = require('bcrypt'); // Import bcrypt
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken'); // Import JWT
// const authMiddleware = require('./src/routes/auth'); // Corrected import
const User = require('./src/modles/user'); // Corrected file path
const {authMiddleware} = require('./src/routes/auth');

app.use(express.json());
app.use(cookieParser()); // Use cookie-parser middleware

// Signup route
app.post("/signup", async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    const pswrdhashed = await bcrypt.hash(password, 12);

    const user = new User({
      firstname,
      lastname,
      email,
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

// Login route
app.post("/login", async (req, res) => {
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

    const token = await jwt.sign({ _id: user._id }, "ramlal@123",{expiresIn:"1D"}); // Use env variable for secret
    res.cookie("token", token);
    res.status(200).send({ message: "Login successful" });
  } catch (error) {
    console.error("Error occurred:", error.message);
    res.status(500).send({ message: "Internal server issue!" });
  }
});
//rpofile route
app.get("/profile",authMiddleware, async (req, res,next) => {
  try {
    const user = req.user; // Access the user from the request object
    if (!user) {
      return res.status(401).send({ message: "User not found" });
    }

    res.send(user);
  } catch (error) {
    console.error("Error occurred:", error.message);
    res.status(500).send({ message: "Internal server issue!" });
  }
});

// Connect to the database
connectDb()
  .then(() => {
    console.log('Database connection successful');
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  });