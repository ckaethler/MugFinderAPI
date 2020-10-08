const handleRegister = (db, bcrypt) => (req, res) => {
    const { email, firstName, lastName, password } = req.body;
    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json("All fields required to register");
    }
    const password_hash = bcrypt.hashSync(password);
    return db.transaction(trx => {
        trx.insert({
            password: password_hash,
            email: email})
        .into('login')
        .returning('email')
        .then(data => {
            return trx('users')
                .returning('*')
                .insert({
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    joined: new Date()})
                .then(user => res.json(user[0]))
                .catch(err => res.status(400).json(err))})
                // .catch(err => res.status(400).json("unable to register"))})
        .then(trx.commit)
        .catch(trx.rollback);
    }).catch(err => console.log(err));
}

module.exports = {
    handleRegister: handleRegister
};