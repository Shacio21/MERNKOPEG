const Pengembalian = require('../models/pengembalian');
const csv = require('csvtojson');
const fs = require('fs');
const { Parser } = require("json2csv");
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const bulan = req.query.bulan;
    const tahun = req.query.tahun; 
    const search = req.query.search || "";
    let query = {};

    // 🔍 Jika ada pencarian
    if (search) {
      const isNumber = !isNaN(search);

      query = isNumber
        ? {
            $or: [
              { Jml: Number(search) },
              { Harga: Number(search) },
              { Potongan: Number(search) },
              { Total_Harga: Number(search) },
              { Tahun: Number(search) },
              { Kode_Item: search }
            ],
          }
        : {
            $or: [
              { Kode_Item: { $regex: search, $options: "i" } },
              { Nama_Item: { $regex: search, $options: "i" } },
              { Satuan: { $regex: search, $options: "i" } },
              { Bulan: { $regex: search, $options: "i" } },
            ],
          };
    }

    if (bulan) {
      query.Bulan = { $regex: new RegExp(`^${bulan}$`, "i") }; // agar tidak case sensitive
    }

    if (tahun) {
      query.Tahun = Number(tahun); // pastikan numerik
    }

    // 🧩 Sorting dinamis
    const sortField = req.query.sortBy || "Tahun";
    const sortOrder = req.query.order === "desc" ? -1 : 1;

    const bulanOrder = [
      "JANUARI", "FEBRUARI", "MARET", "APRIL",
      "MEI", "JUNI", "JULI", "AGUSTUS",
      "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"
    ];

    const totalData = await Pengembalian.countDocuments(query);

    // 🧠 Gunakan agregasi agar bisa sorting custom & convert field
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
                  to: "decimal",  // ✅ aman untuk angka besar (seperti barcode)
                  onError: 0,
                  onNull: 0
                }
              },
              else: 0
            }
          }
        }
      }
    ];

    // 🔄 Tentukan prioritas sorting
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

    const pengembalian = await Pengembalian.aggregate(pipeline);

    // 📦 Kirim hasil response
    res.json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalData / limit),
      totalData,
      sortBy: sortField,
      order: sortOrder === 1 ? "asc" : "desc",
      data: pengembalian,
    });

  } catch (err) {
    console.error('❌ Error getPengembalian:', err);
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

// 📄 Ambil data pengembalian berdasarkan ID
exports.getPengembalianById = async (req, res) => {
  try {
    const pengembalian = await Pengembalian.findById(req.params.id);

    if (!pengembalian) {
      return res.status(404).json({ success: false, message: "Data pengembalian tidak ditemukan" });
    }

    res.status(200).json({ success: true, data: pengembalian });
  } catch (err) {
    console.error('❌ Error getPengembalianById:', err);
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Update data pengembalian berdasarkan ID
exports.updatePengembalian = async (req, res) => {
  try {
    const pengembalian = await Pengembalian.findByIdAndUpdate(req.params.id, req.body, {
      new: true,          // kembalikan data terbaru setelah update
      runValidators: true // jalankan validasi dari schema
    });

    if (!pengembalian) {
      return res.status(404).json({ success: false, message: "Data pengembalian tidak ditemukan" });
    }

    res.status(200).json({
      success: true,
      message: "Data pengembalian berhasil diperbarui",
      data: pengembalian
    });
  } catch (err) {
    console.error('❌ Error updatePengembalian:', err);
    res.status(500).json({ error: err.message });
  }
};

// 🗑️ Hapus data pengembalian berdasarkan ID
exports.deletePengembalian = async (req, res) => {
  try {
    const pengembalian = await Pengembalian.findByIdAndDelete(req.params.id);

    if (!pengembalian) {
      return res.status(404).json({ success: false, message: "Data pengembalian tidak ditemukan" });
    }

    res.status(200).json({
      success: true,
      message: "Data pengembalian berhasil dihapus"
    });
  } catch (err) {
    console.error('❌ Error deletePengembalian:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.exportPengembalianCsv = async (req, res) => {
  try {
    const bulan = req.query.bulan;
    const tahun = req.query.tahun; 
    const search = req.query.search || "";
    let query = {};

    // 🔍 Jika ada pencarian
    if (search) {
      const isNumber = !isNaN(search);

      query = isNumber
        ? {
            $or: [
              { Jml: Number(search) },
              { Harga: Number(search) },
              { Potongan: Number(search) },
              { Total_Harga: Number(search) },
              { Tahun: Number(search) },
              { Kode_Item: search }
            ],
          }
        : {
            $or: [
              { Kode_Item: { $regex: search, $options: "i" } },
              { Nama_Item: { $regex: search, $options: "i" } },
              { Satuan: { $regex: search, $options: "i" } },
              { Bulan: { $regex: search, $options: "i" } },
            ],
          };
    }

    if (bulan) {
      query.Bulan = { $regex: new RegExp(`^${bulan}$`, "i") }; // agar tidak case sensitive
    }

    if (tahun) {
      query.Tahun = Number(tahun); // pastikan numerik
    }

    const pengembalian = await Pengembalian.find(query).lean();

    if (pengembalian.length === 0) {
      return res.status(404).json({ success: false, message: "Tidak ada data untuk diexport" });
    }

    // Tentukan kolom yang akan diexport
    const fields = [
      "Kode_Item",
      "Nama_Item",
      "Satuan",
      "Jml",
      "Harga",
      "Potongan",
      "Total_Harga",
      "Bulan",
      "Tahun"
    ];

    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(pengembalian);

    res.header("Content-Type", "text/csv");
    const namaFile = `pengembalian_export_${bulan || "SEMUA"}_${tahun || "ALL"}_${Date.now()}.csv`;
    res.attachment(namaFile);
    res.send(csv);

  } catch (err) {
    console.error('❌ Error exportPengembalianCsv:', err);
    res.status(500).json({ error: err.message });
  }
};
