const Pengembalian = require('../models/pengembalian');

/**
 * Simpan data pengembalian dari hasil parsing CSV
 * @param {Array} dataArray - array hasil parsing CSV
 */
async function savePengembalianFromCsv(dataArray) {
  if (!Array.isArray(dataArray) || dataArray.length === 0) {
    throw new Error('Data CSV kosong atau tidak valid');
  }

  // Validasi field wajib
  const requiredFields = ['Kode_Item', 'Nama_Item', 'Jml', 'Bulan', 'Tahun'];
  const invalid = dataArray.some(row => !requiredFields.every(f => row[f] !== undefined && row[f] !== ''));

  if (invalid) {
    throw new Error('Beberapa baris CSV tidak memiliki field lengkap');
  }

  // Simpan ke MongoDB
  return await Pengembalian.insertMany(dataArray);
}

module.exports = { savePengembalianFromCsv };
