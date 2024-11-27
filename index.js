const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
    res.send('Hello from Express API!');
});

// Example POST route
app.post('/data', (req, res) => {
    const data = req.body;
    res.json({ message: 'Data received', data });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
