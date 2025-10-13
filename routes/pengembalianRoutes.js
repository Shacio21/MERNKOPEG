const express = require('express');
const router = express.Router();
const { createPengembalian, getPengembalian } = require('../controllers/pengembalianController');

router.post('/', createPengembalian);  // POST /api/pengembalian
router.get('/', getPengembalian);      // GET /api/pengembalian

module.exports = router;
