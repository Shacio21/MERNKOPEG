const mongoose = require("mongoose");

const StockSchema = new mongoose.Schema(
  {
    Kode_Item: { type: Number, default: 0 },
    Nama_Item: { type: String, required: true },
    Bulan: { type: String, required: true },
    Tahun: { type: Number, default: 0},
    Jumlah_Beli: { type: Number, default: 0 },
    Jumlah_Jual: { type: Number, default: 0 },
    Jumlah_Retur: { type: Number, default: 0 },
    Stok_Akhir: { type: Number, default: 0 },
    Keterangan: { type: String, default: "Tersedia" },
  },
  {
    collection: "stok_perbulan",
    timestamps: false,
  }
);

module.exports = mongoose.model("Stock", StockSchema);
