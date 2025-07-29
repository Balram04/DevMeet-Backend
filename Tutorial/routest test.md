const express = require('express');
const app = express();

// Middleware to parse JSON
//app.use(express.json());

// GET request
app.use((req, res) => {
    res.status(404).send({ error: 'Route not' });
});

app.get('/', (req, res) => {
    res.send({ message: 'Hello World!' });
});

// POST request
app.post('/post', (req, res) => {
    res.send({ message: 'Hello from POST request!' });
});

// DELETE request
app.delete('/delete', (req, res) => {
    res.send({ message: 'Hello from DELETE request!' });
});

// PUT request
app.put('/put', (req, res) => {
    res.send({ message: 'Hello from PUT request!' });
});

// Handle undefined routes
app.use((req, res) => {
    res.status(404).send({ error: 'Route not found' });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 4000');
});
