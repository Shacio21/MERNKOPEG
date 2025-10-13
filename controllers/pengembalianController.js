const Pengembalian = require('../models/pengembalian');
const csv = require('csvtojson');
const fs = require('fs');
const { savePengembalianFromCsv } = require('../services/pengembalianService');

exports.createPengembalian = async (req, res) => {
  try {
    const pengembalian = new Pengembalian(req.body);
    await pengembalian.save();
    res.status(201).json({ success: true, message: 'Data pengembalian berhasil disimpan', pengembalian });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPengembalian = async (req, res) => {
  try {
    const pengembalian = await Pengembalian.find();
    res.json(pengembalian);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createPengembalianCsv = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'File CSV tidak ditemukan' });
    }

    const jsonArray = await csv().fromFile(req.file.path);
    await savePengembalianFromCsv(jsonArray);

    fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      message: 'Data CSV pengembalian berhasil disimpan ke MongoDB',
      total: jsonArray.length,
    });
  } catch (err) {
    console.error('❌ Error CSV Pengembalian:', err);
    res.status(500).json({ error: err.message });
  }
};