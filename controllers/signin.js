const handleSignIn = (db, bcrypt) => (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json("Incorrect login credentials.");
    }
    return db
        .select('email', 'password')
        .from('login')
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password,data[0].password);
            if (isValid) {
                return db
                    .select('*')
                    .from('users')
                    .where('email', '=', email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('Unable to get user'))
            } else return res.status(400).json("Credentials incorrect.")})
        .catch(err => res.status(400).json("Credentials incorrect."))
}

module.exports = {
    handleSignIn: handleSignIn
};