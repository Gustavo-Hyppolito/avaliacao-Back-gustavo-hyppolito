const express = require('express')
const router = express.Router()
const usuarioController = require('../controllers/UsuarioController')

const upload = require('../config/multer')

router.get('/', usuarioController.listar)
router.get('/:id', usuarioController.buscarPorId)
router.post('/', upload.single("foto_perfil"), usuarioController.cadastrar)
router.put('/:id', usuarioController.atualizar)
router.delete('/:id', usuarioController.deletar)

module.exports = router