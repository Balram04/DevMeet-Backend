const express = require('express');
const connectDb = require('./config/db');
const User = require('./src/modles/user');

const app = express();

// Middleware to parse JSON request body
app.use(express.json());

app.get("/signup", async (req, res) => {
  try {
    // Await the result of User.find()
    const users = await User.find({ email: req.body.email });

    if (users.length === 0) {
      return res.status(400).send({ message: "User not found" });
    } else {
      return res.status(200).send(users);
    }
  } catch (error) {
    console.error("Error in /signup route:", error.message);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Connect to the database
connectDb()
  .then(() => {
    console.log('Database connection successful');
    // Start the server after the database connection is established
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
    process.exit(1); // Exit the process if the database connection fails
  });