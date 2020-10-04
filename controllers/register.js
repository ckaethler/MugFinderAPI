const handleRegister = (db, bcrypt) => (req, res) => {
    const { email, firstName, lastName, password } = req.body;
    const password_hash = bcrypt.hashSync(password);
    return db.transaction(trx => {
        trx.insert({
            password_hash: password_hash,
            email: email})
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
                .catch(err => res.status(400).json("unable to register"))})
        .then(trx.commit)
        .catch(trx.rollback);
    });
}

module.exports = {
    handleRegister: handleRegister
};