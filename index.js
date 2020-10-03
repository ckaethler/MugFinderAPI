const express = require('express');
const app = express();
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const port = 3001;

app.use(express.json());
app.use(cors());

const database = {
    users: [
        {
            id: '123',
            name: "john",
            email: "john@gmail.com",
            password: "password",
            entries: 0,
            joined: new Date(),
        },
        {
            id: '124',
            name: "sally",
            email: "ckaethler@gmail.com",
            password: "password",
            entries: 3,
            joined: new Date(),
        }
    ],
    login: [
        {
            id: '987',
            hash: '',
            email: 'ckaethler@gmail.com',
        }
    ]
}

app.get('/', (req, res) => {
    res.send(database.users);
})

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

app.post('/signin', (req, res) => {
    bcrypt.compare("bacon", hash, (err, res) => {
        // res === true
    });

    bcrypt.compare("veggies", hash, (err, res) => {
        // res === false
    })

    if(req.body.email === database.users[1].email && 
        req.body.password === database.users[1].password) {
            res.json('success');
        } else {
            res.status(400).json('error logging in');
        }
})

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    bcrypt.hash(password, null, null, function(err, hash) {
        console.log(hash);
    });
    database.users.push({
        id: '125',
        name: name,
        email: email,
        password: password,
        entries: 3,
        joined: new Date(),
    });
    res.json(database.users[database.users.length - 1]);
});

app.post('/image', (req, res) => {
    const { id } = req.body;
    found = false;
    database.users.forEach(user => {
        if(user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    });
    if (!found) {
        return res.status(400).json("error");
    }
});

app.listen(port, () => {
    console.log('app is running on port ', port);
});
// sign in --> POST = success/fail
// register --> POST = user
// profile/:id --> GET = user
// image --> PUT --> user