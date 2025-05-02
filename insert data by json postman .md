const express = require('express');
const connectDb = require('./config/db');
const User = require('./src/modles/user');

const app = express();

// Middleware to parse JSON request body
app.use(express.json());

app.post("/signup", async (req, res) => {

  console.log("Request body:", req.body); // Log the request body for debugging

  const user =new User(req.body); // creat new instance of user model 
  

   try {
    
      await user.save();
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



  //manily  by the using of postman we are saving data into db by using post method