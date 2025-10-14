const mongoose = require("mongoose");
const Stock = require("../models/stock");

exports.refreshStock = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const pembelianCollection = db.collection("pembelian");

    // Cek dan hapus koleksi stok_perbulan jika sudah ada
    const collections = await db.listCollections().toArray();
    const stokExists = collections.some((col) => col.name === "stok_perbulan");

    if (stokExists) {
      await db.collection("stok_perbulan").drop();
      console.log("🗑️ Koleksi stok_perbulan dihapus");
    }

    // Jalankan pipeline agregasi
    await pembelianCollection.aggregate([
      {
        $lookup: {
          from: "penjualan",
          let: { nama: "$Nama_Item", bulan: "$Bulan", tahun: "$Tahun" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$Nama_Item", "$$nama"] },
                    { $eq: ["$Bulan", "$$bulan"] },
                    { $eq: ["$Tahun", "$$tahun"] },
                  ],
                },
              },
            },
          ],
          as: "jual",
        },
      },
      {
        $lookup: {
          from: "pengembalian",
          let: { nama: "$Nama_Item", bulan: "$Bulan", tahun: "$Tahun" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$Nama_Item", "$$nama"] },
                    { $eq: ["$Bulan", "$$bulan"] },
                    { $eq: ["$Tahun", "$$tahun"] },
                  ],
                },
              },
            },
          ],
          as: "retur",
        },
      },
      {
        $group: {
          _id: {
            Kode_Item: "$Kode_Item",
            Nama_Item: "$Nama_Item",
            Bulan: "$Bulan",
            Tahun: "$Tahun",
          },
          Jumlah_Beli: { $sum: "$Jumlah" },
          Jumlah_Jual: { $sum: { $sum: "$jual.Jumlah" } },
          Jumlah_Retur: { $sum: { $sum: "$retur.Jml" } },
        },
      },
      {
        $addFields: {
          Stok_Akhir: {
            $subtract: [
              { $subtract: ["$Jumlah_Beli", "$Jumlah_Jual"] },
              "$Jumlah_Retur",
            ],
          },
        },
      },
      {
        $addFields: {
          Keterangan: {
            $switch: {
              branches: [
                {
                  case: { $lt: ["$Stok_Akhir", 0] },
                  then: "Penjualan_melebihi_stok",
                },
                { case: { $eq: ["$Stok_Akhir", 0] }, then: "Habis" },
              ],
              default: "Tersedia",
            },
          },
        },
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
          Keterangan: 1,
        },
      },
      { $sort: { Tahun: 1, Bulan: 1, Nama_Item: 1 } },
      { $out: "stok_perbulan" },
    ]).toArray();

    res.status(200).json({
      success: true,
      message: "✅ Stok per bulan berhasil direfresh dan disimpan.",
    });
  } catch (err) {
    console.error("❌ Gagal refresh stok:", err);
    res.status(500).json({ error: err.message });
  }
};

// 🟢 GET Semua stok
exports.getStock = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // 🔍 Search global: cek apakah search angka atau teks
    const search = req.query.search || "";
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

    // 🧩 Sort dinamis
    const sortField = req.query.sortBy || "Tahun";
    const sortOrder = req.query.order === "desc" ? -1 : 1;

    const bulanOrder = [
      "JANUARI", "FEBRUARI", "MARET", "APRIL",
      "MEI", "JUNI", "JULI", "AGUSTUS",
      "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"
    ];

    const totalData = await Stock.countDocuments(query);

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

    const stocks = await Stock.aggregate(pipeline);

    res.json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalData / limit),
      totalData,
      sortBy: sortField,
      order: sortOrder === 1 ? "asc" : "desc",
      data: stocks,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getTotalStockPerItem = async (req, res) => {
  try {
    // Ambil filter opsional dari query
    const { tahun, bulan } = req.query;

    const matchStage = {};
    if (tahun) matchStage.Tahun = tahun;
    if (bulan) matchStage.Bulan = bulan;

    // Pipeline agregasi
    const pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: "$Kode_Item",
          Nama_Item: { $first: "$Nama_Item" },
          Total_Stok_Akhir: { $sum: "$Stok_Akhir" },
          Total_Jumlah_Beli: { $sum: "$Jumlah_Beli" },
          Total_Jumlah_Jual: { $sum: "$Jumlah_Jual" },
          Total_Jumlah_Retur: { $sum: "$Jumlah_Retur" }
        }
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
          Total_Stok_Akhir: 1
        }
      }
    ];

    const result = await mongoose.model("Stock").aggregate(pipeline);

    res.status(200).json({
      success: true,
      totalItem: result.length,
      filter: { tahun: tahun || "semua", bulan: bulan || "semua" },
      data: result
    });
  } catch (err) {
    console.error("❌ Gagal menghitung total stok:", err);
    res.status(500).json({ error: err.message });
  }
};


