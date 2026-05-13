const express = require('express');
const router = express.Router();
const AnimalController = require('../controllers/AnimalController');

router.get('/', AnimalController.listar);
router.get('/:id', AnimalController.buscarPorId);
router.post('/', AnimalController.cadastrar);
// TODO: Recupere no arquivo de trechos!
router.delete('/:id', AnimalController.deletar);

module.exports = router;
