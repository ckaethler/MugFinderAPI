const clarifai = require('clarifai');
const app = new Clarifai.App({ apiKey: 'a4a64ffe50b94055b3632f9e41fb7313' });

app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input);


const handleImage = (db) => (req, res) => {
    const { id } = req.body;
    if (!id ) return res.status(400).json("ID required");
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