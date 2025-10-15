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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

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