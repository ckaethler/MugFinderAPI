const handleImage = (db) => (req, res) => {
    const { id } = req.body;
    return db
        .from('users')
        .where('id', '=', id)
        .increment('rank', 1)
        .returning('rank')
        .then(rank => {
            res.json({rank: rank[0]});
        })
        .catch(err => res.status(400).json("Unable to update user rank"));
}

module.exports = {
    handleImage: handleImage
};