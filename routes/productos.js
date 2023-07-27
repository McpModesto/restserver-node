const { Router } = require('express');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');
const { check } = require('express-validator');
const { existeProductoPorId } = require('../helpers/db-validators');
const { obtenerProducto, obtenerProductos, crearProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');
const router = Router();

router.get('/', obtenerProductos);

router.get('/:id', [
    check('id', 'No es un ID válido.').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], obtenerProducto);

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    //validarCampos
], crearProducto);

router.put('/:id',[
    validarJWT,
    check('id').custom(existeProductoPorId),
    validarCampos
], actualizarProducto);

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido.').isMongoId(),
    validarCampos,
    check('id').custom(existeProductoPorId),
], borrarProducto);

module.exports = router;
