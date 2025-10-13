const express = require('express');
const router = express.Router();
const { refreshStock, getStock } = require('../controllers/stockController');

router.post('/refresh', refreshStock);
router.get("/", getStock);

module.exports = router;
