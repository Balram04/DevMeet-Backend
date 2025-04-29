const express = require('express');
const connectDb = require('./config/db');

const app = express();

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
    console.error('Database connection failed:', err.message); // Improved error message
    process.exit(1); // Exit the process if the database connection fails
  });


