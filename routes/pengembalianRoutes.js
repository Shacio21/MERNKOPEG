const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  createPengembalian,
  getPengembalian,
  createPengembalianCsv,
  getPengembalianById,
  updatePengembalian,
  deletePengembalian,
  exportPengembalianCsv
} = require('../controllers/pengembalianController');

// 🗂️ Setup multer
const upload = multer({ dest: 'uploads/' });

// 📥 Tambah data pengembalian
router.post('/', createPengembalian);

// 📋 Ambil semua data pengembalian
router.get('/', getPengembalian);

// 📤 Export data ke CSV
router.get('/export-csv', exportPengembalianCsv);

// 📄 Ambil 1 data berdasarkan ID
router.get('/:id', getPengembalianById);

// ✏️ Update data berdasarkan ID
router.put('/:id', updatePengembalian);

// 🗑️ Hapus data berdasarkan ID
router.delete('/:id', deletePengembalian);

// 📤 Upload CSV
router.post('/upload-csv', upload.single('file'), createPengembalianCsv);

module.exports = router;
