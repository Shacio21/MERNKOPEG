const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createPembelian, getPembelian, createPembelianCsv } = require('../controllers/pembelianController');

// setup multer (temp folder untuk menyimpan file upload)
const upload = multer({ dest: 'uploads/' });

router.post('/', createPembelian);  // POST /api/pembelian
router.get('/', getPembelian);      // GET /api/pembelian
router.post('/upload-csv', upload.single('file'), createPembelianCsv); // ← tambahkan upload.single('file')

module.exports = router;
