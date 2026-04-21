const express = require('express');
const router = express.Router();
const { refreshStock, getStock, getTotalStockPerItem, stockOpname, exportStockCsv } = require('../controllers/stockController');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.post('/refresh', refreshStock);
router.get("/", getStock);
router.get("/export-csv", exportStockCsv); // Endpoint untuk ekspor data ke CSV
router.get("/total", getTotalStockPerItem); // Endpoint untuk ekspor data ke CSV
router.post('/stok-opname', upload.single('file'), stockOpname)

module.exports = router;
