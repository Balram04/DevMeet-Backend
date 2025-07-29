const express = require('express');

const app = express();

// Middleware for '/job' routes
app.use('/job', (req, res, next) => {
    console.log('Checking authorization for /job routes');
    const token = "123"; // Hardcoded token for simplicity

    const isAuthorized = token === "123";
    if (!isAuthorized) {
        return res.status(401).send('Unauthorized'); // Send a plain string response
    } else {
        console.log('Token is valid');
    }

    next(); // Proceed to the next middleware or route handler
});

// Route: /job/j
app.get('/job/j', (req, res) => {
    console.log('Handling /job/j route');
    res.send('Job route jj'); // Send a plain string response
});

// Route: /job/jo
app.get('/job/jo', (req, res) => {
    console.log('Handling /job/jo route');
    res.send('Job route jo'); // Send a plain string response
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});