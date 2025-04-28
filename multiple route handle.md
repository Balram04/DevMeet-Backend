const express = require('express');
const app = express();



// POST request
app.get('/post', (req, res ,next) => {
    console.log("woking 1")
    next();                                           //next will work but give error bcz js will reach to res.send but that res is already full filled
    res.send({ message: 'Hello from POST request!' });
    
},
(req, res) => {
    console.log("working 2")
    res.send({ message: 'Hello from DELETE request!' });
});



// Handle undefined routes
app.use((req, res) => {
    res.status(404).send({ error: 'Route not found' });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 4000');
});
