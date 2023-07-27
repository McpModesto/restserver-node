const { Router } = require('express');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');
const { check } = require('express-validator');
const { crearCategoria, actualizarCategoria, borrarCategoria, obtenerCategoria, obtenerCategorias } = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');
const router = Router();

// Obtener todas las categorías.
router.get('/', obtenerCategorias);

// Obtener una categoría.
router.get('/:id', [
    check('id', 'No es un ID válido.').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], obtenerCategoria);

// Crear categoría - privado - cualquier persona con un token válido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

// Actualizar - privado - cualquier persona con token válido.
router.put('/:id',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], actualizarCategoria);

// Borrar una categoría - Admin.
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido.').isMongoId(),
    validarCampos,
    check('id').custom(existeCategoriaPorId),
], borrarCategoria);

module.exports = router;
