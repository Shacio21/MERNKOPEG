const express = require('express');
const multer = require('multer');
const router = express.Router();
const { createPengembalian, getPengembalian, createPengembalianCsv } = require('../controllers/pengembalianController');

const upload = multer({ dest: 'uploads/' });

router.post('/', createPengembalian);  // POST /api/pengembalian
router.get('/', getPengembalian);      // GET /api/pengembalian
router.post('/upload-csv', upload.single('file'), createPengembalianCsv);

module.exports = router;