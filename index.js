const express = require('express');
const app = express();
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const port = 3001;
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : '',
      database : 'mugfinder-db'
    }
});

db.select('*').from('users').then(data => {
    console.log(data);
});

// Tells express to use CORS and convert to JSON
app.use(express.json());
app.use(cors());

// Example Database


// Retrieves all database information
app.get('/', (req, res) => {
    res.send(database.users);
})

// Retrieves specific person based on their ID
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if(user.id === id) {
            found = true;
            return res.json(user);
        } 
    });
    if (!found) {
        res.status(400).json('not found');
    }
});

// Authenticates sign in request
app.post('/signin', (req, res) => {
    // bcrypt.compare("bacon", hash, (err, res) => {
    //     // res === true
    // });

    // bcrypt.compare("veggies", hash, (err, res) => {
    //     // res === false
    // })

    if(req.body.email === database.users[0].email && 
        req.body.password === database.users[0].password) {
            res.json(database.users[0]);
        } else {
            res.status(400).json('error logging in');
        }
})

// Authenticates register request
app.post('/register', (req, res) => {
    const { email, firstName, lastName, password } = req.body;
    db('users').insert({
        email: email,
        firstName: firstName,
        lastName: lastName,
        joined: new Date(),
    }).then(data => console.log(data));
});

// Handles when a user searches an image for a face
app.put('/image', (req, res) => {
    const { id } = req.body;
    found = false;
    database.users.forEach(user => {
        if(user.id === id) {
            found = true;
            user.rank++;
            return res.json({rank: user.rank});
        }
    });
    if (!found) {
        return res.status(400).json("error");
    }
});

// Creates API listener
app.listen(port, () => {
    console.log('app is running on port ', port);
});