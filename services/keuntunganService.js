// services/keuntunganService.js
const Pembelian = require('../models/pembelian');
const Penjualan = require('../models/penjualan');
const Pengembalian = require('../models/pengembalian');

async function hitungKeuntungan(bulan, tahun) {
  // Total pembelian
  const pembelian = await Pembelian.aggregate([
    { $match: { Bulan: bulan, Tahun: parseInt(tahun) } },
    { $group: { _id: null, total: { $sum: "$Total_Harga" } } }
  ]);

  // Total penjualan
  const penjualan = await Penjualan.aggregate([
    { $match: { Bulan: bulan, Tahun: parseInt(tahun) } },
    { $group: { _id: null, total: { $sum: "$Total_Harga" } } }
  ]);

  // Total pengembalian
  const pengembalian = await Pengembalian.aggregate([
    { $match: { Bulan: bulan, Tahun: parseInt(tahun) } },
    { $group: { _id: null, total: { $sum: "$Total_Harga" } } }
  ]);

  const totalPembelian = pembelian[0]?.total || 0;
  const totalPenjualan = penjualan[0]?.total || 0;
  const totalPengembalian = pengembalian[0]?.total || 0;

  const keuntungan = totalPenjualan - (totalPembelian - totalPengembalian);

  return {
    bulan,
    tahun,
    totalPembelian,
    totalPenjualan,
    totalPengembalian,
    keuntungan
  };
}

module.exports = { hitungKeuntungan };
