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
    // ambil query dari URL → ?page=1&limit=10&search=namaBarang
    const page = parseInt(req.query.page) || 1;      // halaman aktif
    const limit = parseInt(req.query.limit) || 10;   // jumlah data per halaman
    const skip = (page - 1) * limit;

    // opsional: pencarian (misal berdasarkan namaBarang)
    const search = req.query.search || "";
    const query = search
      ? { namaBarang: { $regex: search, $options: "i" } }
      : {};

    // ambil total data & data sesuai pagination
    const totalData = await Pengembalian.countDocuments(query);
    const pengembalian = await Pengembalian.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ tanggal: -1 }); // urutkan dari terbaru

    // kirim hasil dalam format rapi
    res.json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalData / limit),
      totalData,
      data: pengembalian
    });

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