const express = require('express');
const router = express.Router();
const { refreshStock, getStock, getTotalStockPerItem } = require('../controllers/stockController');

router.post('/refresh', refreshStock);
router.get("/", getStock);
router.get("/total", getTotalStockPerItem); // Endpoint untuk ekspor data ke CSV

module.exports = router;
