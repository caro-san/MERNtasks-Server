const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.authenticateUser = async (req, res) => {
    //revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty() ){
        return res.status(400).json({errores: errores.array() })
    }

    // extraer el email y password
    const { email, password } = req.body;

    try {
        //revisar que sea un usuario registrado
        let user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({ msg: 'User does not exist'});
        }

        //Revisar el pass
        const passCorrect = await bcryptjs.compare(password, user.password);
        if(!passCorrect){
            return res.status(400).json({ msg: 'Incorrect Password'})
        }

        //Si todo es correcto crear y firmar el JWT
        const payload = {
            user: {
                id: user.id
            }
        };

        //Firmar el JWT
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600 //1 hora
        }, ( error, token ) => {
            if(error) throw error;

            //Mensaje de confirmacion
            res.json( { token })
        });

    } catch (error) {
        console.log(error);
    }

}

//Obtiene que usuario esta autenticado
exports.userAuthenticated = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({user});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Error 500'});
        
    }
}