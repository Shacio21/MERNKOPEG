const Penjualan = require('../models/penjualan');

// ➕ Input data penjualan baru
exports.createPenjualan = async (req, res) => {
  try {
    const penjualan = new Penjualan(req.body);
    await penjualan.save();
    res.status(201).json({ success: true, message: 'Data penjualan berhasil disimpan', penjualan });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📋 Ambil semua data penjualan
exports.getPenjualan = async (req, res) => {
  try {
    const penjualan = await Penjualan.find();
    res.json(penjualan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
