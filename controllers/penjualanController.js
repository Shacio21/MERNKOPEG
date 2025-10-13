const Penjualan = require('../models/penjualan');
const fs = require('fs');
const csv = require('csvtojson');
const { savePenjualanFromCsv } = require('../services/penjualanService');

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

exports.createPenjualanCsv = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'File CSV tidak ditemukan' });
    }

    const jsonArray = await csv().fromFile(req.file.path);
    await savePenjualanFromCsv(jsonArray);

    fs.unlinkSync(req.file.path); // hapus file setelah upload

    res.status(201).json({
      success: true,
      message: 'Data CSV penjualan berhasil disimpan ke MongoDB',
      total: jsonArray.length,
    });
  } catch (err) {
    console.error('❌ Error CSV Penjualan:', err);
    res.status(500).json({ error: err.message });
  }
};