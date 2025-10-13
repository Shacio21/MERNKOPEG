const mongoose = require('mongoose');

const penjualanSchema = new mongoose.Schema({
  Kode_Item: String,
  Nama_Item: String,
  Jenis: String,
  Jumlah: Number,
  Satuan: String,
  Total_Harga: Number,
  Bulan: String,
  Tahun: Number
});

const Penjualan = mongoose.model('penjualan', penjualanSchema, 'penjualan');

module.exports = Penjualan;
