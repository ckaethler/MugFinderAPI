const handleSignIn = (db, bcrypt) => (req, res) => {
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
}

module.exports = {
    handleSignIn: handleSignIn
};