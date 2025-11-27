const Penjualan = require('../models/penjualan');

/**
 * Simpan data penjualan dari hasil parsing CSV
 * @param {Array} dataArray - array hasil parsing CSV
 */
async function savePenjualanFromCsv(dataArray) {
  if (!Array.isArray(dataArray) || dataArray.length === 0) {
    throw new Error('Data CSV kosong atau tidak valid');
  }

  // Validasi sederhana: pastikan field utama ada
  const requiredFields = ['Kode_Item', 'Nama_Item', 'Jumlah', 'Bulan', 'Tahun'];
  const invalid = dataArray.some(row => !requiredFields.every(f => row[f] !== undefined && row[f] !== ''));

  if (invalid) {
    throw new Error('Beberapa baris CSV tidak memiliki field yang lengkap');
  }

  // Simpan ke koleksi "penjualan"
  return await Penjualan.insertMany(dataArray);
}

module.exports = { savePenjualanFromCsv };
