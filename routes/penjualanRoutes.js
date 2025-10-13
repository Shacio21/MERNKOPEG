const express = require('express');
const router = express.Router();
const { createPenjualan, getPenjualan } = require('../controllers/penjualanController');

router.post('/', createPenjualan);  // POST /api/penjualan
router.get('/', getPenjualan);      // GET /api/penjualan

module.exports = router;
