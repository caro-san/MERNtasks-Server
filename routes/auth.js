//Rutas para autenticar usuario
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

//Iniciar sesion
//api/auth
router.post('/', 
    authController.authenticateUser
);

router.get('/',
    auth,
    authController.userAuthenticated
)

module.exports = router;