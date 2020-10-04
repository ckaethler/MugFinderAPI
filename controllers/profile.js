const handleGetProfile = (db) => (req, res) => {
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
}

module.exports = {
    handleGetProfile: handleGetProfile
};