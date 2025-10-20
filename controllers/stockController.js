const mongoose = require("mongoose");
const Stock = require("../models/stock");
const fs = require("fs");
const csv = require("csvtojson");
const { Parser } = require("json2csv");

exports.refreshStock = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const pembelianCollection = db.collection("pembelian");

    await pembelianCollection.aggregate([
      {
        $lookup: {
          from: "penjualan",
          let: { nama: "$Nama_Item", bulan: "$Bulan", tahun: "$Tahun" },
          pipeline: [
            { $match: { $expr: { $and: [
              { $eq: ["$Nama_Item", "$$nama"] },
              { $eq: ["$Bulan", "$$bulan"] },
              { $eq: ["$Tahun", "$$tahun"] }
            ]}}}
          ],
          as: "jual"
        }
      },
      {
        $lookup: {
          from: "pengembalian",
          let: { nama: "$Nama_Item", bulan: "$Bulan", tahun: "$Tahun" },
          pipeline: [
            { $match: { $expr: { $and: [
              { $eq: ["$Nama_Item", "$$nama"] },
              { $eq: ["$Bulan", "$$bulan"] },
              { $eq: ["$Tahun", "$$tahun"] }
            ]}}}
          ],
          as: "retur"
        }
      },
      {
        $group: {
          _id: {
            Kode_Item: "$Kode_Item",
            Nama_Item: "$Nama_Item",
            Bulan: "$Bulan",
            Tahun: "$Tahun"
          },
          Jumlah_Beli: { $sum: "$Jumlah" },
          Jumlah_Jual: { $sum: { $sum: "$jual.Jumlah" } },
          Jumlah_Retur: { $sum: { $sum: "$retur.Jml" } }
        }
      },
      {
        $addFields: {
          Stok_Akhir: {
            $subtract: [
              { $subtract: ["$Jumlah_Beli", "$Jumlah_Jual"] },
              "$Jumlah_Retur"
            ]
          },
          Keterangan: {
            $switch: {
              branches: [
                { case: { $lt: ["$Stok_Akhir", 0] }, then: "Penjualan_melebihi_stok" },
                { case: { $eq: ["$Stok_Akhir", 0] }, then: "Habis" }
              ],
              default: "Tersedia"
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          Kode_Item: "$_id.Kode_Item",
          Nama_Item: "$_id.Nama_Item",
          Bulan: "$_id.Bulan",
          Tahun: "$_id.Tahun",
          Jumlah_Beli: 1,
          Jumlah_Jual: 1,
          Jumlah_Retur: 1,
          Stok_Akhir: 1,
          Keterangan: 1
        }
      },
      { $sort: { Tahun: 1, Bulan: 1, Nama_Item: 1 } },
      {
        $merge: {
          into: "stok_perbulan",
          whenMatched: "replace",
          whenNotMatched: "insert"
        }
      }
    ]).toArray();

    res.status(200).json({
      success: true,
      message: "✅ Stok per bulan berhasil direfresh dan disimpan.",
    });
    console.log("Selesai di refresh");
  } catch (err) {
    console.error("❌ Gagal refresh stok:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.getStock = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search || "";
    const bulan = req.query.bulan;
    const tahun = req.query.tahun;
    let query = {};

    if (search) {
      const isNumber = !isNaN(search);
      query = isNumber
        ? {
            $or: [
              { Kode_Item: Number(search) },
              { Jumlah_Beli: Number(search) },
              { Jumlah_Jual: Number(search) },
              { Jumlah_Retur: Number(search) },
              { Stok_Akhir: Number(search) },
              { Tahun: Number(search) },
            ],
          }
        : {
            $or: [
              { Nama_Item: { $regex: search, $options: "i" } },
              { Bulan: { $regex: search, $options: "i" } },
              { Keterangan: { $regex: search, $options: "i" } },
            ],
          };
    }

    if (bulan) {
      query.Bulan = { $regex: new RegExp(`^${bulan}$`, "i") };
    }
    if (tahun) {
      query.Tahun = Number(tahun);
    }

    const sortField = req.query.sortBy || "Tahun";
    const sortOrder = req.query.order === "desc" ? -1 : 1;

    const bulanOrder = [
      "JANUARI", "FEBRUARI", "MARET", "APRIL",
      "MEI", "JUNI", "JULI", "AGUSTUS",
      "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"
    ];

    // ✅ Hitung total data pakai pipeline agar konsisten
    const totalPipeline = [{ $match: query }, { $count: "total" }];
    const totalResult = await Stock.aggregate(totalPipeline);
    const totalData = totalResult[0]?.total || 0;

    const pipeline = [
      { $match: query },
      {
        $addFields: {
          bulanIndex: { $indexOfArray: [bulanOrder, "$Bulan"] },
        },
      },
    ];

    const sortObj = {};
    if (sortField === "Bulan") sortObj["bulanIndex"] = sortOrder;
    else sortObj[sortField] = sortOrder;

    pipeline.push({ $sort: sortObj }, { $skip: skip }, { $limit: limit });

    const stocks = await Stock.aggregate(pipeline);

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalData / limit),
      totalData,
      sortBy: sortField,
      order: sortOrder === 1 ? "asc" : "desc",
      data: stocks,
    });
  } catch (err) {
    console.error("❌ Error getStock:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getTotalStockPerItem = async (req, res) => {
  try {
    // Ambil query params
    const { tahun, bulan, search } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // 🔍 Filter dasar (tahun & bulan)
    const matchStage = {};
    if (tahun) matchStage.Tahun = tahun;
    if (bulan) matchStage.Bulan = bulan;

    // 🔍 Filter pencarian global
    const searchStage = [];
    if (search) {
      const isNumber = !isNaN(search);
      if (isNumber) {
        searchStage.push({ Kode_Item: search });
      } else {
        searchStage.push({
          Nama_Item: { $regex: search, $options: "i" },
        });
      }
    }

    // Pipeline agregasi utama
    const pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: "$Kode_Item",
          Nama_Item: { $first: "$Nama_Item" },
          Total_Stok_Akhir: { $sum: "$Stok_Akhir" },
          Total_Jumlah_Beli: { $sum: "$Jumlah_Beli" },
          Total_Jumlah_Jual: { $sum: "$Jumlah_Jual" },
          Total_Jumlah_Retur: { $sum: "$Jumlah_Retur" },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          Kode_Item: "$_id",
          Nama_Item: 1,
          Total_Jumlah_Beli: 1,
          Total_Jumlah_Jual: 1,
          Total_Jumlah_Retur: 1,
          Total_Stok_Akhir: 1,
        },
      },
    ];

    // Setelah digroup, baru lakukan search
    if (searchStage.length > 0) {
      pipeline.push({ $match: { $or: searchStage } });
    }

    // Hitung total data sebelum pagination
    const allData = await mongoose.model("Stock").aggregate(pipeline);
    const totalData = allData.length;

    // Tambahkan pagination
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    const result = await mongoose.model("Stock").aggregate(pipeline);

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalData / limit),
      totalData,
      filter: { tahun: tahun || "semua", bulan: bulan || "semua" },
      search: search || "tidak ada",
      data: result,
    });
  } catch (err) {
    console.error("❌ Gagal menghitung total stok:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.stockOpname = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File CSV tidak ditemukan." });
    }

    const csvDataRaw = await csv().fromFile(req.file.path);
    const dbDataRaw = await Stock.find().lean();

    // 🧹 Hilangkan duplikat di CSV dan DB berdasarkan (Kode_Item, Bulan, Tahun)
    const key = (d) => `${d.Kode_Item}-${d.Bulan?.toUpperCase()}-${d.Tahun}`;

    const csvData = Array.from(new Map(csvDataRaw.map((d) => [key(d), d])).values());
    const dbData = Array.from(new Map(dbDataRaw.map((d) => [key(d), d])).values());

    const perbedaan = [];

    csvData.forEach((csvItem) => {
      const dbItem = dbData.find(
        (d) =>
          Number(d.Kode_Item) === Number(csvItem.Kode_Item) &&
          d.Bulan?.toUpperCase() === csvItem.Bulan?.toUpperCase() &&
          Number(d.Tahun) === Number(csvItem.Tahun)
      );

      if (dbItem) {
        const fields = ["Jumlah_Beli", "Jumlah_Jual", "Jumlah_Retur", "Stok_Akhir"];
        const berbeda = fields.some(
          (f) => Number(dbItem[f]) !== Number(csvItem[f])
        );

        if (berbeda) {
          perbedaan.push({
            Kode_Item: csvItem.Kode_Item,
            Nama_Item: csvItem.Nama_Item || dbItem.Nama_Item,
            Bulan: csvItem.Bulan,
            Tahun: csvItem.Tahun,
            CSV: {
              Jumlah_Beli: csvItem.Jumlah_Beli,
              Jumlah_Jual: csvItem.Jumlah_Jual,
              Jumlah_Retur: csvItem.Jumlah_Retur,
              Stok_Akhir: csvItem.Stok_Akhir,
            },
            DB: {
              Jumlah_Beli: dbItem.Jumlah_Beli,
              Jumlah_Jual: dbItem.Jumlah_Jual,
              Jumlah_Retur: dbItem.Jumlah_Retur,
              Stok_Akhir: dbItem.Stok_Akhir,
            },
          });
        }
      } else {
        perbedaan.push({
          Kode_Item: csvItem.Kode_Item,
          Nama_Item: csvItem.Nama_Item,
          Bulan: csvItem.Bulan,
          Tahun: csvItem.Tahun,
          Keterangan: "Data tidak ditemukan di database untuk bulan & tahun ini",
        });
      }
    });

    fs.unlink(req.file.path, (err) => {
      if (err) console.warn("Gagal hapus file upload:", err);
    });

    if (perbedaan.length > 0) {
      return res.status(200).json({
        message: "Ditemukan perbedaan data stok berdasarkan Kode_Item, Bulan, dan Tahun",
        perbedaan,
      });
    } else {
      return res.status(200).json({ message: "Tidak ada perbedaan data." });
    }
  } catch (error) {
    console.error("Error saat stok opname:", error);
    return res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};


exports.exportStockCsv = async (req, res) => {
  await this.refreshStock(req, { json: () => {}, status: () => ({ json: () => {} }) });
  try {
    const search = req.query.search || "";
    const bulan = req.query.bulan ? req.query.bulan.toUpperCase() : null;
    const tahun = req.query.tahun ? Number(req.query.tahun) : null;
    let query = {};

    // 🔎 Filter Bulan & Tahun
    if (bulan) {
      query.Bulan = { $regex: new RegExp(`^${bulan}$`, "i") }; // case-insensitive
    }
    if (tahun) {
      query.Tahun = Number(tahun);
    }

    // 🔍 Filter pencarian global
    if (search) {
      const isNumber = !isNaN(search);
      query = isNumber
        ? {
            $or: [
              { Kode_Item: Number(search) },
              { Jumlah_Beli: Number(search) },
              { Jumlah_Jual: Number(search) },
              { Jumlah_Retur: Number(search) },
              { Stok_Akhir: Number(search) },
              { Tahun: Number(search) },
            ],
          }
        : {
            $or: [
              { Nama_Item: { $regex: search, $options: "i" } },
              { Bulan: { $regex: search, $options: "i" } },
              { Keterangan: { $regex: search, $options: "i" } },
            ],
          };
    }

    // 🧠 Ambil data stok
    const stok = await Stock.find(query).lean();

    if (!stok || stok.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Tidak ada data stok untuk diexport",
      });
    }

    // Kolom yang akan diexport
    const fields = [
      "Kode_Item",
      "Nama_Item",
      "Bulan",
      "Tahun",
      "Jumlah_Beli",
      "Jumlah_Jual",
      "Jumlah_Retur",
      "Stok_Akhir",
      "Keterangan",
    ];

    // Convert JSON → CSV
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(stok);

    // Header untuk auto-download
    res.header("Content-Type", "text/csv");
    const namaFile = `stok_export_${bulan || "SEMUA"}_${tahun || "ALL"}_${Date.now()}.csv`;
    res.attachment(namaFile);
    res.send(csv);
  } catch (err) {
    console.error("❌ Error exportStockCsv:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};



