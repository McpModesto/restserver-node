const { request, response } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async(req = request, res = response) => {
    const { correo, password } = req.body;

    try {

        // Verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }

        // Si el usuario está activo
        if (usuario.estado == false) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }

        // Verificar la contraseña
        const validPassword = bcrypt.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            })
        };

        // Generar el JWT
        const token = await generarJWT(usuario.id);
        return res.status(200).json({
            usuario,
            token
        });

        return res.status(200).json({
            msg: 'Login ok'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Se ha producido un error'
        });
    }

};

module.exports = {
    login
}