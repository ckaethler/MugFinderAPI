const express = require('express');
const app = express();
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const port = process.env.PORT || 3001;
const knex = require('knex');

app.use(express.json());
app.use(cors());

const { handleRegister } = require('./controllers/register');
const { handleSignIn } = require('./controllers/signin');
const { handleGetProfile } = require('./controllers/profile');
const { handleImage, handleAPICall } = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : '',
      database : 'mugfinder-db'
    }
});

app.get('/', (req, res) => res.send("MugFinder up and running"));
app.get('/profile/:id', handleGetProfile(db));
app.post('/signin', handleSignIn(db, bcrypt));
app.post('/register', handleRegister(db, bcrypt));
app.put('/image', handleImage(db));
app.post('/imageurl', handleAPICall());

app.listen(port, () => {
    console.log('app is running on port ', port);
});