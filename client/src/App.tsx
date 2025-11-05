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
        {/* ✅ Landing Page sekarang pakai ProtectedRoute */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <LandingPage />
            </ProtectedRoute>
          }
        />

        {/* Login Page */}
        <Route path="/login" element={<LoginForm />} />

        {/* Protected routes */}
        <Route
          path="/rekap"
          element={
            <ProtectedRoute>
              <Rekap />
            </ProtectedRoute>
          }
        />

        <Route
          path="/stok"
          element={
            <ProtectedRoute>
              <Stok />
            </ProtectedRoute>
          }
        />

        <Route
          path="/prediksi"
          element={
            <ProtectedRoute>
              <PrediksiPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Rekap"
          element={
            <ProtectedRoute>
              <StokLayout />
            </ProtectedRoute>
          }
        >
          <Route path="laba" element={<Laba />} />
          <Route path="produklaris" element={<ProdukLaris />} />
        </Route>

        <Route
          path="/Stok"
          element={
            <ProtectedRoute>
              <StokLayout />
            </ProtectedRoute>
          }
        >
          <Route path="total" element={<StockTable />} />
          <Route path="bulanan" element={<StockOpname />} />
        </Route>

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

        {/* Redirect semua path tak dikenal ke /login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
