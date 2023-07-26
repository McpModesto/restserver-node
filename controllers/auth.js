const { request, response } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

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

const googleSignIn = async(req, res = response) => {
    const { id_token } = req.body;

    try {
        const { nombre, imagen, correo } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            // Tengo que crearlo.
            const data = {
                nombre,
                correo,
                password: "123456",
                imagen,
                google: true,
                rol: 'ADMIN_ROLE'
            }
            usuario = new Usuario(data);
            await usuario.save();
        }

        // Si el usuario en DB es false.
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Generar JWT.
        const token = await generarJWT('dsaasdasdda54');

        res.json({
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Token de Google no es válido'
        })
    }

}

module.exports = {
    login,
    googleSignIn
}