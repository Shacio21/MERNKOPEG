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
              { Jumlah: Number(search) },
              { Total_Harga: Number(search) },
              { Tahun: Number(search) },
            ],
          }
        : {
            $or: [
              { Kode_Item: { $regex: search, $options: "i" } },
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

    const totalData = await Penjualan.countDocuments(query);

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

    const penjualan = await Penjualan.aggregate(pipeline);

    res.json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalData / limit),
      totalData,
      sortBy: sortField,
      order: sortOrder === 1 ? "asc" : "desc",
      data: penjualan,
    });
  } catch (err) {
    console.error(err);
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