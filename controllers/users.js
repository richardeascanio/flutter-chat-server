const { response } = require("express")
const User = require('../models/user');

const getUsers = async (req, res = response) => {

    const from = Number(req.query.from) || 0;

    const users = await User
        .find({_id: {$ne: req.uid}}) // regresa todos menos el usuario cuyo id sea igual al que esta haciendo la petición 
        .sort('-online') // '-' indicates DESCENDING, without it they will be sorted ASCENDING
        .skip(from)
        .limit(20)

    res.json({
        ok: true,
        users
    });

}

module.exports = {
    getUsers
}