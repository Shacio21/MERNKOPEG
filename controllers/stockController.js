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
    const stocks = await Stock.find().sort({ Tahun: 1, Bulan: 1, Nama_Item: 1 });
    res.status(200).json(stocks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
