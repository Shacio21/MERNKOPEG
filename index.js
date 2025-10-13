const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const pembelianRoutes = require('./routes/pembelianRoutes');
const penjualanRoutes = require('./routes/penjualanRoutes');
const pengembalianRoutes = require('./routes/pengembalianRoutes');
const stockRoutes = require('./routes/stockRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// koneksi ke MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/kopeg_db')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// routing utama
app.use('/api/auth', authRoutes);
app.use('/api/pengembalian', pengembalianRoutes);
app.use('/api/penjualan', penjualanRoutes);
app.use('/api/pembelian', pembelianRoutes);
app.use('/api/stok', stockRoutes);

app.get('/', (req, res) => {
  res.send('Server is running...');
});

const PORT = 3001;
app.listen(PORT, () => console.log(`🚀 Server running on http://127.0.0.1:${PORT}`));
