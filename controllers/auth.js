const { response } = require('express');
const bcrypt = require('bcryptjs')

const User = require('../models/user');
const { generateJWT } = require('../helpers/jwt');

const createUser = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const duplicateEmail = await User.findOne({ email })
        if (duplicateEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }

        const user = new User(req.body);

        // Encriptar password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        // Generate JWT
        const token = await generateJWT(user.id);
    
        res.json({
            ok: true,
            user,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }

}

const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const userDB = await User.findOne({ email });

        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontró dirección de correo'
            });
        }

        // Validate password
        const validPassword = bcrypt.compareSync(password, userDB.password)
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña no es válida'
            }); 
        }

        // Generate JWT
        const token = await generateJWT(userDB.id);

        return res.json({
            ok: true,
            user: userDB,
            token
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }

}

const renewToken = async (req, res = response) => {

    const uid = req.uid;

    const token = await generateJWT(uid);

    const user = await User.findById(uid);

    res.json({
        ok: true,
        user,
        token
    });

}

module.exports = {
    createUser,
    login,
    renewToken
}