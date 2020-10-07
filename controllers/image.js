const clarifai = require('clarifai');
const { json, response } = require('express');
const app = new Clarifai.App({ apiKey: 'a4a64ffe50b94055b3632f9e41fb7313' });

const handleAPICall = () => (req, res) => {
    const errorMess = "Either URL is faulty or server is down.";
    app.models
        .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(response => res.json(response))
        .catch(err => res.status(400).json(errorMess));
}

const handleImage = (db) => (req, res) => {
    const { id } = req.body;
    if (!id ) return res.status(400).json("ID required");
    return db
        .from('users')
        .where('id', '=', id)
        .increment('rank', 1)
        .returning('rank')
        .then(rank => res.json({rank: rank[0]}))
        .catch(err => res.status(400).json("Unable to update user rank"));
}

module.exports = {
    handleImage: handleImage,
    handleAPICall: handleAPICall
};