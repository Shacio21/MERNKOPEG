const Pembelian = require("../models/pembelian");
const csv = require("csvtojson");
const fs = require("fs");

exports.createPembelian = async (req, res) => {
  try {
    const pembelian = new Pembelian(req.body);
    await pembelian.save();
    res.status(201).json({ success: true, message: "Pembelian berhasil disimpan", pembelian });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPembelian = async (req, res) => {
  try {
    const pembelian = await Pembelian.find();
    res.json(pembelian);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createPembelianCsv = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "File tidak ditemukan" });
    }

    const filePath = req.file.path;
    const jsonArray = await csv().fromFile(filePath);

    // Simpan langsung ke MongoDB
    await Pembelian.insertMany(jsonArray);

    // Hapus file setelah diproses
    fs.unlinkSync(filePath);

    res.status(201).json({
      success: true,
      message: "Data CSV berhasil disimpan ke MongoDB",
      total: jsonArray.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
