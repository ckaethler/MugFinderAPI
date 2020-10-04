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

// Tells express to use CORS and convert to JSON
app.use(express.json());
app.use(cors());

// Retrieves specific person based on their ID
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    return db
        .select('*')
        .from('users')
        .where({id})
        .then(user => {
            if(user.length) res.json(user[0]);
            else res.status(400).json('user not found');
        })
        .catch(err => res.status(400).json('Unable to get user information'));
});

// Authenticates sign in request
app.post('/signin', (req, res) => {
    const {email, password} = req.body;
    return db
        .select('email', 'password_hash')
        .from('login')
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password,data[0].password_hash);
            if (isValid) {
                return db
                    .select('*')
                    .from('users')
                    .where('email', '=', req.body.email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('Unable to get user'))
            } else return res.status(400).json("Credentials incorrect.");
        }).catch(err => res.status(400).json("Credentials incorrect."))
})

// Authenticates & handles new user çregister request
app.post('/register', (req, res) => {
    const { email, firstName, lastName, password } = req.body;
    const password_hash = bcrypt.hashSync(password);
    return db.transaction(trx => {
        trx.insert({
            password_hash: password_hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
                .returning('*')
                .insert({
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    joined: new Date()
                })
                .then(user => res.json(user[0]))
                .catch(err => res.status(400).json("unable to register"));
        })
    .then(trx.commit)
    .catch(trx.rollback);
    })
    
});

// Handles when a user searches an image by updating user rank
app.put('/image', (req, res) => {
    const { id } = req.body;
    return db('users')
        .where('id', '=', id)
        .increment('rank', 1)
        .returning('rank')
        .then(rank => res.json("Rank updated to " + rank))
        .catch(err => res.status(400).json("Unable to update user rank"));
});

// Creates API listener
app.listen(port, () => {
    console.log('app is running on port ', port);
});