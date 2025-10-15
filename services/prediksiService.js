const Penjualan = require("../models/penjualan");
const Pembelian = require("../models/pembelian");
const Pengembalian = require("../models/pengembalian");
const Stock = require("../models/stock");

// Helper untuk ubah Bulan (string) ke angka
function bulanKeAngka(bulan) {
  const daftarBulan = {
    Januari: 1, Februari: 2, Maret: 3, April: 4,
    Mei: 5, Juni: 6, Juli: 7, Agustus: 8,
    September: 9, Oktober: 10, November: 11, Desember: 12
  };
  return daftarBulan[bulan] || 0;
}

exports.prediksiPenjualan = async () => {
  const data = await Penjualan.find({});
  const agregatPerBulan = {};

  data.forEach(d => {
    const key = `${d.Tahun}-${bulanKeAngka(d.Bulan)}`;
    if (!agregatPerBulan[key]) agregatPerBulan[key] = 0;
    agregatPerBulan[key] += d.Total_Harga;
  });

  const bulanTahun = Object.keys(agregatPerBulan).sort();
  const nilai = bulanTahun.map(k => agregatPerBulan[k]);

  if (nilai.length < 2) return { prediksi: nilai[nilai.length - 1] };

  const growth = (nilai[nilai.length - 1] - nilai[nilai.length - 2]) / nilai[nilai.length - 2];
  const prediksi = nilai[nilai.length - 1] * (1 + growth);

  return { bulanSelanjutnya: "Prediksi bulan depan", prediksi };
};

exports.prediksiKeuntungan = async () => {
  const penjualan = await Penjualan.aggregate([
    { $group: { _id: { Tahun: "$Tahun", Bulan: "$Bulan" }, total: { $sum: "$Total_Harga" } } }
  ]);

  const pembelian = await Pembelian.aggregate([
    { $group: { _id: { Tahun: "$Tahun", Bulan: "$Bulan" }, total: { $sum: "$Total_Harga" } } }
  ]);

  const keuntunganPerBulan = {};

  penjualan.forEach(p => {
    const key = `${p._id.Tahun}-${bulanKeAngka(p._id.Bulan)}`;
    keuntunganPerBulan[key] = (keuntunganPerBulan[key] || 0) + p.total;
  });

  pembelian.forEach(b => {
    const key = `${b._id.Tahun}-${bulanKeAngka(b._id.Bulan)}`;
    keuntunganPerBulan[key] = (keuntunganPerBulan[key] || 0) - b.total;
  });

  const keys = Object.keys(keuntunganPerBulan).sort();
  const values = keys.map(k => keuntunganPerBulan[k]);

  if (values.length < 2) return { prediksi: values[values.length - 1] };

  const growth = (values[values.length - 1] - values[values.length - 2]) / values[values.length - 2];
  const prediksi = values[values.length - 1] * (1 + growth);

  return { prediksi };
};

exports.prediksiStok = async () => {
  const stokData = await Stock.find({});
  const stokPerBulan = {};

  stokData.forEach(s => {
    const key = `${s.Tahun}-${bulanKeAngka(s.Bulan)}`;
    if (!stokPerBulan[key]) stokPerBulan[key] = 0;
    stokPerBulan[key] += s.Stok_Akhir;
  });

  const keys = Object.keys(stokPerBulan).sort();
  const values = keys.map(k => stokPerBulan[k]);

  if (values.length < 2) return { prediksi: values[values.length - 1] };

  const trend = values[values.length - 1] - values[values.length - 2];
  const prediksi = values[values.length - 1] + trend;

  return { prediksi };
};
