const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  createPenjualan,
  getPenjualan,
  createPenjualanCsv,
  getPenjualanById,
  updatePenjualan,
  deletePenjualan,
  exportPenjualanToCsv
} = require('../controllers/penjualanController');
const { route } = require('./pengembalianRoutes');

// 🗂️ Setup multer
const upload = multer({ dest: 'uploads/' });

router.post('/', createPenjualan);

router.get('/', getPenjualan);

router.post('/upload-csv', upload.single('file'), createPenjualanCsv);

router.get('/export-csv', exportPenjualanToCsv);

router.get('/:id', getPenjualanById);

router.put('/:id', updatePenjualan);

router.delete('/:id', deletePenjualan);

module.exports = router;
