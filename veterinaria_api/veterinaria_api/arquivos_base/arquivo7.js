const express = require('express');
const router = express.Router();
const animalRoutes = require('./animalRoutes');

router.use('/api/animais', animalRoutes);

module.exports = router;
