const express = require('express');
const connectDb = require('./config/db');
const modApi = require('./src/modles/user');

const app = express();

// Middleware to parse JSON request body
app.use(express.json());

app.post("/signup", async (req, res) => {
   try {
      const modapi = new modApi({
         firstname: "radhe",
         lastname: "prajapti",
         email: "jems@499.gmail",
          password: "123456",

      });

      await modapi.save();
      res.send("Data saved successfully");
   } catch (error) {
      console.error("Error saving data:", error.message);
      res.status(500).send("Internal Server Error");
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
    console.error('Database connection failed:', err.message); // Improved error message
    process.exit(1); // Exit the process if the database connection fails
  });


