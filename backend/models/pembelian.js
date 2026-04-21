const mongoose = require('mongoose');

const pembelianSchema = new mongoose.Schema({
  Kode_Item: Number,
  Nama_Item: String,
  Jenis: String,
  Jumlah: Number,
  Satuan: String,
  Total_Harga: Number,
  Bulan: String,
  Tahun: Number
});

const Pembelian = mongoose.model('pembelian', pembelianSchema, 'pembelian');

module.exports = Pembelian;
