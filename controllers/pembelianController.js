const Pembelian = require("../models/pembelian");
const csv = require("csvtojson");
const fs = require("fs");
const { savePembelianFromCsv } = require('../services/pembelianService');

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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // 🔍 Search global: cek apakah search adalah angka atau teks
    const search = req.query.search || "";
    let query = {};

    if (search) {
      const isNumber = !isNaN(search);

      query = isNumber
        ? {
            $or: [
              { Kode_Item: Number(search) },
              { Jumlah: Number(search) },
              { Total_Harga: Number(search) },
              { Tahun: Number(search) },
            ],
          }
        : {
            $or: [
              { Nama_Item: { $regex: search, $options: "i" } },
              { Jenis: { $regex: search, $options: "i" } },
              { Satuan: { $regex: search, $options: "i" } },
              { Bulan: { $regex: search, $options: "i" } },
            ],
          };
    }

    // 🧩 Sort dinamis
    const sortField = req.query.sortBy || "Tahun";
    const sortOrder = req.query.order === "desc" ? -1 : 1;

    const bulanOrder = [
      "JANUARI", "FEBRUARI", "MARET", "APRIL",
      "MEI", "JUNI", "JULI", "AGUSTUS",
      "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"
    ];

    const totalData = await Pembelian.countDocuments(query);

    const pipeline = [
      { $match: query },
      {
        $addFields: {
          bulanIndex: { $indexOfArray: [bulanOrder, "$Bulan"] },
        },
      },
    ];

    const sortObj = {};
    if (sortField === "Bulan") {
      sortObj["bulanIndex"] = sortOrder;
    } else {
      sortObj[sortField] = sortOrder;
    }

    pipeline.push({ $sort: sortObj });
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    const pembelian = await Pembelian.aggregate(pipeline);

    res.json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalData / limit),
      totalData,
      sortBy: sortField,
      order: sortOrder === 1 ? "asc" : "desc",
      data: pembelian,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


exports.createPembelianCsv = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'File tidak ditemukan' });
    }

    const filePath = req.file.path;
    const jsonArray = await csv().fromFile(filePath);

    const result = await savePembelianFromCsv(jsonArray);

    fs.unlinkSync(filePath);

    res.status(201).json({
      success: true,
      message: 'Data CSV berhasil disimpan ke MongoDB',
      total: result.length,
    });
  } catch (err) {
    console.error('❌ Error createPembelianCsv:', err);
    res.status(500).json({ error: err.message });
  }
};

// 📄 Ambil data pembelian berdasarkan ID
exports.getPembelianById = async (req, res) => {
  try {
    const pembelian = await Pembelian.findById(req.params.id);

    if (!pembelian) {
      return res.status(404).json({ success: false, message: "Data tidak ditemukan" });
    }

    res.status(200).json({ success: true, data: pembelian });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Update data pembelian berdasarkan ID
exports.updatePembelian = async (req, res) => {
  try {
    const pembelian = await Pembelian.findByIdAndUpdate(req.params.id, req.body, {
      new: true,      // Mengembalikan data setelah update
      runValidators: true // Menjalankan validasi dari schema
    });

    if (!pembelian) {
      return res.status(404).json({ success: false, message: "Data tidak ditemukan" });
    }

    res.status(200).json({
      success: true,
      message: "Data pembelian berhasil diperbarui",
      data: pembelian
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🗑️ Hapus data pembelian berdasarkan ID
exports.deletePembelian = async (req, res) => {
  try {
    const pembelian = await Pembelian.findByIdAndDelete(req.params.id);

    if (!pembelian) {
      return res.status(404).json({ success: false, message: "Data tidak ditemukan" });
    }

    res.status(200).json({
      success: true,
      message: "Data pembelian berhasil dihapus"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


