const express = require('express');
const db = require('./db');
const songsRouter = require('./routes/songs');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/songs', songsRouter);

app.get('/', (req, res) => {
    res.send('Welcome to Tuner');
});

app.use((req, res) => {
    res.status(404).send('404 Not Found');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});