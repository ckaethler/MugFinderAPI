const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('this is working');
})

app.listen(port, () => {
    console.log('app is running on port ', port);
});

// sign in --> POST = success/fail
// register --> POST = user
// profile/:id --> GET = user
// image --> PUT --> user