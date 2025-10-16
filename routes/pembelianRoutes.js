const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  createPembelian,
  getPembelian,
  createPembelianCsv,
  updatePembelian,
  getPembelianById,
  deletePembelian
} = require('../controllers/pembelianController');

// 🗂️ Setup multer (folder sementara untuk upload file)
const upload = multer({ dest: 'uploads/' });

// 📥 Tambah data pembelian
router.post('/', createPembelian);

// 📋 Ambil semua data pembelian (dengan pagination, search, sort)
router.get('/', getPembelian);

// 📄 Ambil 1 data pembelian berdasarkan ID
router.get('/:id', getPembelianById);

// ✏️ Update data pembelian berdasarkan ID
router.put('/:id', updatePembelian);

// 🗑️ Hapus data pembelian berdasarkan ID
router.delete('/:id', deletePembelian);

// 📤 Upload file CSV dan simpan ke database
router.post('/upload-csv', upload.single('file'), createPembelianCsv);

module.exports = router;
