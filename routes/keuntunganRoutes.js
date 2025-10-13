// routes/keuntunganRoutes.js
const express = require('express');
const router = express.Router();
const { getKeuntungan } = require('../controllers/keuntunganController');

router.get('/', getKeuntungan); // GET /api/keuntungan?bulan=Januari&tahun=2025

module.exports = router;
