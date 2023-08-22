const { mongoose } = require('mongoose');
const { Role, Usuario, Categoria, Producto } = require('../models');

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

const existeCategoriaPorId = async(id) => {
    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria) {
        throw new Error(`La categoría no existe.`);
    }
}

const existeProductoPorId = async(id) => {
    const existeProducto = await Producto.findById(id);
    if (!existeProducto) {
        throw new Error(`La categoría no existe.`);
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

const coleccionesPermitidas = async(coleccion = '', colecciones = []) => {
    if (!colecciones.includes(coleccion)) {
        throw new Error(`Colección ${coleccion} no es permitida. ${colecciones}`);
    }
    return true;
}

module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}

