const mongoose = require('mongoose');

const pengembalianSchema = new mongoose.Schema({
  No: Number,
  Kode_Item: String,
  Nama_Item: String,
  Jml: Number,
  Satuan: String,
  Harga: Number,
  Potongan: Number, // ubah "Pot. %" jadi nama field yang valid di JS
  Total_Harga: Number,
  Bulan: String,
  Tahun: Number
});

const Pengembalian = mongoose.model('pengembalian', pengembalianSchema, 'pengembalian');

module.exports = Pengembalian;
