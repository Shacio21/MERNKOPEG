// controllers/keuntunganController.js
const { hitungKeuntungan } = require('../services/keuntunganService');

exports.getKeuntungan = async (req, res) => {
  try {
    const { bulan, tahun } = req.query;
    if (!bulan || !tahun) {
      return res.status(400).json({ error: "Bulan dan tahun harus diisi" });
    }

    const hasil = await hitungKeuntungan(bulan, tahun);
    res.status(200).json(hasil);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
