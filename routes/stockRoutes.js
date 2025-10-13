const express = require('express');
const router = express.Router();
const {refreshStock} = require('../controllers/stockController');

router.post('/refresh', refreshStock);

module.exports = router;
