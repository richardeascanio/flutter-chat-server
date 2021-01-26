/*
    path: api/login
*/
const { Router } = require('express');
const { check } = require('express-validator');

const { createUser, login, renewToken } = require('../controllers/auth');
const { validateData } = require('../middlewares/validate-data');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();


router.post('/new', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El correo es obligatorio').not().isEmpty(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    check('email', 'Ingresa una dirección de correo válida').isEmail(),
    validateData
], createUser);

router.post('/', [
    check('email', 'El correo es obligatorio').not().isEmpty(),
    check('email', 'Ingresa una dirección de correo válida').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validateData
], login);

router.get('/renew', validateJWT, renewToken);


module.exports = router;