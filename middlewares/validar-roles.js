const { response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const esAdminRole = async(req, res = response, next) => {

    try {
        if (!req.usuario) {
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe'
            });  
        }

        // Verificar si el usuario no es de tipo admin.
        if (req.usuario.rol !== 'ADMIN_ROLE') {
            return res.status(401).json({
                msg: 'Token no válido - usuario no es admin'
            });
        }

        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        });
    }
    
}

const tieneRole = (...roles) => {

    return (req, res = response, next) => {

        if (!req.usuario) {
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe'
            });  
        }

        if (!roles.includes(req.usuario.rol)) {
            return res.status(401).json({
                msg: 'El usuario no tiene permisos'
            });
        }
        next();
    };

};

module.exports = {
    esAdminRole,
    tieneRole
}