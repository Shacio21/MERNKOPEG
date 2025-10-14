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

async function hitungSemuaKeuntungan() {
  // Ambil daftar unik bulan & tahun dari koleksi pembelian
  const periodeList = await Pembelian.aggregate([
    {
      $group: {
        _id: { Bulan: "$Bulan", Tahun: "$Tahun" }
      }
    },
    {
      $project: {
        _id: 0,
        Bulan: "$_id.Bulan",
        Tahun: "$_id.Tahun"
      }
    },
    { $sort: { Tahun: 1 } }
  ]);

  const hasil = [];

  // Loop setiap periode (bulan+tahun)
  for (const periode of periodeList) {
    const { Bulan, Tahun } = periode;

    // Total pembelian
    const pembelian = await Pembelian.aggregate([
      { $match: { Bulan, Tahun } },
      { $group: { _id: null, total: { $sum: "$Total_Harga" } } }
    ]);

    // Total penjualan
    const penjualan = await Penjualan.aggregate([
      { $match: { Bulan, Tahun } },
      { $group: { _id: null, total: { $sum: "$Total_Harga" } } }
    ]);

    // Total pengembalian
    const pengembalian = await Pengembalian.aggregate([
      { $match: { Bulan, Tahun } },
      { $group: { _id: null, total: { $sum: "$Total_Harga" } } }
    ]);

    const totalPembelian = pembelian[0]?.total || 0;
    const totalPenjualan = penjualan[0]?.total || 0;
    const totalPengembalian = pengembalian[0]?.total || 0;

    const keuntungan = totalPenjualan - (totalPembelian - totalPengembalian);

    hasil.push({
      Bulan,
      Tahun,
      totalPembelian,
      totalPenjualan,
      totalPengembalian,
      keuntungan
    });
  }

  // Urutkan berdasarkan Tahun dan urutan bulan
  const bulanOrder = [
    "JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI",
    "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"
  ];

  hasil.sort((a, b) => {
    if (a.Tahun !== b.Tahun) return a.Tahun - b.Tahun;
    return bulanOrder.indexOf(a.Bulan) - bulanOrder.indexOf(b.Bulan);
  });

  return hasil;
}

module.exports = { hitungKeuntungan, hitungSemuaKeuntungan };
