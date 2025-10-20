const Penjualan = require('../models/penjualan');
const fs = require('fs');
const csv = require('csvtojson');
const { savePenjualanFromCsv } = require('../services/penjualanService');
const { Parser } = require('json2csv');

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
    const search = req.query.search || "";
    const bulan = req.query.bulan;
    const tahun = req.query.tahun; 
    let query = {};

    // 🔍 Filter berdasarkan pencarian (search)
    if (search) {
      const isNumber = !isNaN(search);

      query = isNumber
        ? {
            $or: [
              { Jumlah: Number(search) },
              { Total_Harga: Number(search) },
              { Tahun: Number(search) },
              { Kode_Item: search },
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

    // 🗓️ Filter tambahan: bulan & tahun
    if (bulan) {
      query.Bulan = { $regex: new RegExp(`^${bulan}$`, "i") }; // agar tidak case sensitive
    }

    if (tahun) {
      query.Tahun = Number(tahun); // pastikan numerik
    }

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
          kodeItemNum: {
            $cond: {
              if: { $regexMatch: { input: "$Kode_Item", regex: /^[0-9]+$/ } },
              then: {
                $convert: {
                  input: "$Kode_Item",
                  to: "decimal",
                  onError: 0,
                  onNull: 0
                }
              },
              else: 0
            }
          }
        },
      },
    ];

    const sortObj = {};
    if (sortField === "Bulan") {
      sortObj["bulanIndex"] = sortOrder;
    } else if (sortField === "Kode_Item") {
      sortObj["kodeItemNum"] = sortOrder;
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


// 📦 Import CSV
exports.createPenjualanCsv = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'File CSV tidak ditemukan' });
    }

    const jsonArray = await csv().fromFile(req.file.path);
    await savePenjualanFromCsv(jsonArray);

    fs.unlinkSync(req.file.path);

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

// 📄 Ambil data penjualan berdasarkan ID
exports.getPenjualanById = async (req, res) => {
  try {
    const penjualan = await Penjualan.findById(req.params.id);

    if (!penjualan) {
      return res.status(404).json({ success: false, message: "Data penjualan tidak ditemukan" });
    }

    res.status(200).json({ success: true, data: penjualan });
  } catch (err) {
    console.error('❌ Error getPenjualanById:', err);
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Update data penjualan berdasarkan ID
exports.updatePenjualan = async (req, res) => {
  try {
    const penjualan = await Penjualan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,          // kembalikan data terbaru setelah update
      runValidators: true // jalankan validasi schema
    });

    if (!penjualan) {
      return res.status(404).json({ success: false, message: "Data penjualan tidak ditemukan" });
    }

    res.status(200).json({
      success: true,
      message: "Data penjualan berhasil diperbarui",
      data: penjualan
    });
  } catch (err) {
    console.error('❌ Error updatePenjualan:', err);
    res.status(500).json({ error: err.message });
  }
};

// 🗑️ Hapus data penjualan berdasarkan ID
exports.deletePenjualan = async (req, res) => {
  try {
    const penjualan = await Penjualan.findByIdAndDelete(req.params.id);

    if (!penjualan) {
      return res.status(404).json({ success: false, message: "Data penjualan tidak ditemukan" });
    }

    res.status(200).json({
      success: true,
      message: "Data penjualan berhasil dihapus"
    });
  } catch (err) {
    console.error('❌ Error deletePenjualan:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.exportPenjualanToCsv = async (req, res) => {
  try {
    const search = req.query.search || "";
    const bulan = req.query.bulan; 
    const tahun = req.query.tahun;
    let query = {};

    if (bulan) {
      query.Bulan = { $regex: new RegExp(`^${bulan}$`, "i") }; // agar tidak case sensitive
    }

    if (tahun) {
      query.Tahun = Number(tahun); // pastikan numerik
    }

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

    const penjualan = await Penjualan.find(query).lean(); 

    if (!penjualan || penjualan.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Tidak ada data penjualan untuk diexport" 
      });
    }

    const fields = [
      "Kode_Item",
      "Nama_Item",
      "Jenis",
      "Jumlah",
      "Satuan",
      "Total_Harga",
      "Bulan",
      "Tahun"
    ];

    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(penjualan);

    // 🔽 Siapkan response agar langsung jadi file CSV yang bisa di-download
    res.header("Content-Type", "text/csv");
    const namaFile = `penjualan_export_${bulan || "SEMUA"}_${tahun || "ALL"}_${Date.now()}.csv`;
    res.attachment(namaFile);
    return res.send(csv);
  } catch (err) {
    console.error("❌ Error exportPenjualanToCsv:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};