const { Router } = require('express');
const { usuariosGet, usuariosDelete, usuariosPatch, usuariosPut, usuariosPost } = require('../controllers/usuarios');
const { check } = require('express-validator');
const { esRolValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { validarJWT, validarCampos, tieneRole, esAdminRole } = require('../middlewares');
const router = Router();

router.get('/', usuariosGet);
router.put('/:id', [
    check('id', 'No es un ID válido.').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRolValido),
    validarCampos
], usuariosPut);
router.post('/', [
    check('nombre', 'El nombre es requerido').not().isEmpty(),
    check('correo', 'El correo es requerido').not().isEmpty(),
    check('correo').custom(emailExiste),
    check('password', 'Debe tener más de 6 letras').isLength({min: 6}),
    // check('rol', 'El rol es obligatorio').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom(esRolValido),
    validarCampos
],usuariosPost);
router.patch('/', usuariosPatch);
router.delete('/:id', [
    validarJWT,
    // esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID válido.').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete);

module.exports = router;

