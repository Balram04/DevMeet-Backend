const express = require('express');
const connectDb = require('./config/db');
const app = express();
const cors =require('cors'); // Import CORS
const cookieParser = require('cookie-parser');
const http =require("http")
const HandleSocket = require('./src/routes/Socket'); // Import the Socket handler


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
const reqRouter = require('./src/routes/request');
// feed route
const feedRouter = require('./src/routes/feed');

const userRouter =require('./src/routes/user');

app.use('/', authRouter);
app.use('/', proRouter);
app.use('/', reqRouter);
app.use('/', feedRouter);
app.use('/',userRouter);


const server = http.createServer(app);
HandleSocket(server);


// Connect to the database
connectDb()
  .then(() => {
    console.log('Database connection successful');
    server.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  });