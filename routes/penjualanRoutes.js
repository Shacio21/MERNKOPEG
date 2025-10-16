const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  createPenjualan,
  getPenjualan,
  createPenjualanCsv,
  getPenjualanById,
  updatePenjualan,
  deletePenjualan
} = require('../controllers/penjualanController');

// 🗂️ Setup multer
const upload = multer({ dest: 'uploads/' });

// ➕ Tambah data penjualan
router.post('/', createPenjualan);

// 📋 Ambil semua data penjualan
router.get('/', getPenjualan);

// 📄 Ambil satu data berdasarkan ID
router.get('/:id', getPenjualanById);

// ✏️ Update data penjualan berdasarkan ID
router.put('/:id', updatePenjualan);

// 🗑️ Hapus data penjualan berdasarkan ID
router.delete('/:id', deletePenjualan);

// 📤 Upload CSV
router.post('/upload-csv', upload.single('file'), createPenjualanCsv);

module.exports = router;
