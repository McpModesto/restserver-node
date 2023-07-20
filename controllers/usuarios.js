const { request, response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');

const usuariosGet = async(req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    // const usuarios = await Usuario.find({estado: true})
    //     .skip(Number(desde))
    //     .limit(limite);
    // const total = await Usuario.countDocuments({estado: true});
    const query = {estado: true};

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(limite)
    ]);

    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async(req, res = response) => {

    const { nombre, correo, password, rol} = req.body;
    // Usamos el modelo de usuario.
    const usuario = new Usuario({
        nombre,
        correo,
        password,
        rol
    });
    
    // Encriptar la contraseña
    const salt = bcrypt.genSaltSync(10);
    usuario.password = bcrypt.hashSync(password, salt)
    // Guardar en base de datos.
    await usuario.save();

    res.status(403).json({
        type: 'post API - controlador',
        usuario
    });
}

const usuariosPut = async(req, res = response) => {
    const { id } = req.params;
    const { _id, password, google, correo, ...resto} = req.body;

    // Validar contra base de datos.
    if (password) {
        const salt = bcrypt.genSaltSync(10);
        resto.password = bcrypt.hashSync(password, salt)
    }

    // Devuelve objeto ya actualizado.
    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json({usuario});
}

const usuariosPatch = (req, res = response) => {
    res.status(403).json({
        type: 'patch API - controlador'
    });
}

const usuariosDelete = async(req, res = response) => {
    const { id } = req.params;

    const usuarioAdmin = req.usuario;
    // Físicamente lo borramos.
    // const usuario = await Usuario.findByIdAndDelete(id);
    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});

    res.json({
        usuario,
        usuarioAdmin
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
};
