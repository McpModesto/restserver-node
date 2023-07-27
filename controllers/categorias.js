const { request, response } = require('express');
const Categoria = require('../models/categoria');
const { default: mongoose } = require('mongoose');

const obtenerCategorias = async(req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario', 'nombre')
            .skip(Number(desde))
            .limit(limite)
    ]);

    res.json({
        total,
        categorias
    });

}

const obtenerCategoria = async(req = request, res = response) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`No es un ID válido`);
    }
    const categoriaDB = await Categoria.findById(id)
                                        .populate('usuario', 'nombre');

    res.status(200).json(categoriaDB);
}

const crearCategoria = async(req = request, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});
    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoría ${nombre} ya existe.`
        });
    }

    // Generar data a guardar.
    const data = {
        nombre,
        usuario: req.usuario._id
    }
    // Usamos el modelo de categoría.
    const categoria = new Categoria(data);
    // Guardar en base de datos.
    await categoria.save();

    res.status(201).json(categoria);
}

// actualizarCategoria
const actualizarCategoria = async(req = request, res = response) => {
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });
    res.json(categoria);
}

// borrarCategoria - estado: false
const borrarCategoria = async(req = request, res = response) => {
    const { id } = req.params;
    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, {estado: false}, { new: true });
    res.json(categoriaBorrada);
}

module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
};
