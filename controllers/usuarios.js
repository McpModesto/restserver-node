const { request, response } = require('express');

const usuariosGet = (req = request, res = response) => {
    const {q, nombre = "No name", apikey, page = 1, limit} = req.query;
    res.status(403).json({
        type: 'get API - controlador',
        nombre
    });
}
const usuariosPost = (req, res = response) => {
    const { nombre, edad } = req.body;

    res.status(403).json({
        type: 'post API - controlador',
        nombre,
        edad
    });
}
const usuariosPut = (req, res = response) => {
    const id = req.params.id;

    res.status(403).json({
        type: 'put API - controlador',
        id
    });
}
const usuariosPatch = (req, res = response) => {
    res.status(403).json({
        type: 'patch API - controlador'
    });
}
const usuariosDelete = (req, res = response) => {
    res.status(403).json({
        type: 'delete API - controlador'
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
};
