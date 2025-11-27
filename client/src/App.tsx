import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/landingpage";
import LoginForm from "./components/login/LoginForm";
import TransaksiLayout from "./components/transaksi/TransaksiLayout";
import Pembelian from "./pages/transaksi/Pembelian";
import Penjualan from "./pages/transaksi/Penjualan";
import Rekap from "./pages/Rekap";
import Laba from "./components/rekap/Laba";
import ProdukLaris from "./components/rekap/ProdukLaris";
import Pengembalian from "./pages/transaksi/Pengembalian";
import Stok from "./pages/stok/StokTotal";
import StokLayout from "./components/stok/TransaksiLayout";
import StockTable from "./components/stok/total/StokTable";
import StockOpname from "./components/stok/opname/StokOpname";
import PrediksiPage from "./pages/PrediksiPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Semua halaman INI bebas diakses */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/rekap" element={<Rekap />} />
        <Route path="/stok" element={<Stok />} />
        <Route path="/prediksi" element={<PrediksiPage />} />

        {/* Rekap Subpage */}
        <Route path="/Rekap" element={<StokLayout />}>
          <Route path="laba" element={<Laba />} />
          <Route path="produklaris" element={<ProdukLaris />} />
        </Route>

        {/* Stok Subpage */}
        <Route path="/Stok" element={<StokLayout />}>
          <Route path="total" element={<StockTable />} />
          <Route path="bulanan" element={<StockOpname />} />
        </Route>

        {/* Khusus Transaksi Wajib Login */}
        <Route
          path="/Transaksi"
          element={
            <ProtectedRoute>
              <TransaksiLayout />
            </ProtectedRoute>
          }
        >
          <Route path="pembelian" element={<Pembelian />} />
          <Route path="penjualan" element={<Penjualan />} />
          <Route path="pengembalian" element={<Pengembalian />} />
        </Route>

        {/* Redirect jika URL tidak ditemukan */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
