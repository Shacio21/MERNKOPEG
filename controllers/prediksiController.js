const prediksiService = require("../services/prediksiService");

exports.getPrediksiPenjualan = async (req, res) => {
  try {
    const result = await prediksiService.prediksiPenjualan();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPrediksiKeuntungan = async (req, res) => {
  try {
    const result = await prediksiService.prediksiKeuntungan();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPrediksiStok = async (req, res) => {
  try {
    const result = await prediksiService.prediksiStok();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
