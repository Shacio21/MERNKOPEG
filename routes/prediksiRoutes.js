const express = require("express");
const router = express.Router();
const prediksiController = require("../controllers/prediksiController");

router.get("/penjualan", prediksiController.getPrediksiPenjualan);
router.get("/keuntungan", prediksiController.getPrediksiKeuntungan);
router.get("/stok", prediksiController.getPrediksiStok);

module.exports = router;
