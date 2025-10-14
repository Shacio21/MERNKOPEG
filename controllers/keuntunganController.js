// controllers/keuntunganController.js
const { hitungKeuntungan, hitungSemuaKeuntungan } = require('../services/keuntunganService');

exports.getKeuntungan = async (req, res) => {
  try {
    const { bulan, tahun } = req.query;
    if (!bulan || !tahun) {
      const hasil = await hitungSemuaKeuntungan();
      res.status(200).json(hasil);
    } else {
      const hasil = await hitungKeuntungan(bulan, tahun);
      res.status(200).json(hasil);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
