const { request, response } = require('express');
const Producto = require('../models/producto');
const { default: mongoose } = require('mongoose');

const obtenerProductos = async(req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .skip(Number(desde))
            .limit(limite)
    ]);

    res.json({
        total,
        productos
    });
}

const obtenerProducto = async(req = request, res = response) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`No es un ID válido`);
    }
    const productoDB = await Producto.findById(id)
                                        .populate('usuario', 'nombre');

    res.status(200).json(productoDB);
}

const crearProducto = async(req = request, res = response) => {

    const nombre = req.body.nombre.toUpperCase();
    const productoDB = await Producto.findOne({nombre});
    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${nombre} ya existe.`
        });
    }

    // Generar data a guardar.
    const data = {
        nombre,
        usuario: req.usuario._id
    }
    // Usamos el modelo de categoría.
    const producto = new Producto(data);
    // Guardar en base de datos.
    await producto.save();

    res.status(201).json(producto);
}

const actualizarProducto = async(req = request, res = response) => {
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });
    res.json(producto);
}

const borrarProducto = async(req = request, res = response) => {
    const { id } = req.params;
    const productoBorrado = await Producto.findByIdAndUpdate(id, {estado: false}, { new: true });
    res.json(productoBorrado);
}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
};
