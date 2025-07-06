const express = require('express');
const connectDb = require('./config/db');
const app = express();
const bcrypt =require('bcrypt'); // Import bcrypt
const cors =require('cors'); // Import CORS
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken'); // Import JWT
// const authMiddleware = require('./src/routes/auth'); // Corrected import
const User = require('./src/models/user'); // Corrected file path
const {authMiddleware} = require('./src/middlewares/auth');

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
})); // Use CORS middleware

app.use(express.json());
app.use(cookieParser()); // Use cookie-parser middleware

// Signup route // Login route
const authRouter = require('./src/routes/auth');
//profile route
const proRouter = require('./src/routes/profile');
//connection request route
const reqRouter = require('./src/routes/cnrequest');
// feed route
const feedRouter = require('./src/routes/feed');

app.use('/', authRouter);
app.use('/', proRouter);
app.use('/', reqRouter);
app.use('/', feedRouter);




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