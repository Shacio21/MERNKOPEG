const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createPenjualan, getPenjualan } = require('../controllers/penjualanController');
const { createPenjualanCsv } = require('../controllers/penjualanController');

const upload = multer({ dest: 'uploads/' });

router.post('/', createPenjualan);  // POST /api/penjualan
router.get('/', getPenjualan);      // GET /api/penjualan
router.post('/upload-csv', upload.single('file'), createPenjualanCsv);

module.exports = router;
