const Pengembalian = require('../models/pengembalian');

// ➕ Tambah data pengembalian
exports.createPengembalian = async (req, res) => {
  try {
    const pengembalian = new Pengembalian(req.body);
    await pengembalian.save();
    res.status(201).json({ success: true, message: 'Data pengembalian berhasil disimpan', pengembalian });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📋 Ambil semua data pengembalian
exports.getPengembalian = async (req, res) => {
  try {
    const pengembalian = await Pengembalian.find();
    res.json(pengembalian);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
