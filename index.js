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

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
const db = knex({
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: true 
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