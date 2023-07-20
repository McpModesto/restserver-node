const { mongoose } = require('mongoose');
const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRolValido = async(rol = '') => {
    const existeRol = await Role.findOne({rol})
    if (!existeRol) {
        throw new Error(`El rol ${rol} no está registrado en la base de datos.`);
    }
};

const emailExiste = async(correo = '') => {
    const existeEmail = await Usuario.findOne({ correo });
    if (existeEmail) {
        throw new Error(`El correo ${correo} ya está registrado.`);
    }
}

const existeUsuarioPorId = async(id = '') => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`No es un ID válido`);
    }
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id no existe: ${id}.`);
    }
}

module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorId
}

