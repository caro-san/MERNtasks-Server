const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {

    //Here it's checked for errors
    const errores = validationResult(req);
    if( !errores.isEmpty() ){
        return res.status(400).json({errores: errores.array()})
    }

    //Extraer email y pass
    const { email, password} = req.body;
    
    try {
        //Revisar que el usuario registrado sea unico
        let user = await User.findOne({ email });

        if(user) {
            return res.status(400).json({ msg: 'User already exists'});
        }

        //crea el nuevo usuario
        user = new User(req.body);

        //Hashear el pass
        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(password, salt);

        // guardar usuario
        await user.save();

        //Crear y firmar el JWT
        const payload = {
            user: {
                id: user.id
            }
        };

        //firmar el JWT
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600000 // 1 semana //1 hora = 3600
        }, (error, token) => {
            if(error) throw error;

            //Mensaje de confirmacion
            res.json({ token });
        });

    } catch (error) {
        console.log (error);
        res.status(400).send('There was a mistake');
    }
}