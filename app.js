require('dotenv').config();
const express = require('express');
const connectDb = require('./config/db');
const app = express();
const cors =require('cors'); // Import CORS
const cookieParser = require('cookie-parser');
const http =require("http")
const HandleSocket = require('./src/routes/Socket'); // Import the Socket handler

// Trust proxy for production (important for Render)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}


app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
})); // Use CORS middleware

app.use(express.json());
app.use(cookieParser()); // Use cookie-parser middleware

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'DevMeet Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'DevMeet API Server',
    version: '1.0.0',
    status: 'Running'
  });
});

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
    const PORT = process.env.PORT || 3000;
    const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
    
    server.listen(PORT, HOST, () => {
      console.log(`Server is running on ${HOST}:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  });