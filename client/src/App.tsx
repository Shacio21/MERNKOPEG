import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingpage";
import LoginForm from "./components/login/LoginForm";
import TransaksiLayout from "./components/transaksi/TransaksiLayout";
import Pembelian from "./pages/transaksi/Pembelian";
import Penjualan from "./pages/transaksi/Penjualan";
import Rekap from "./pages/Rekap";
import Stock from "./pages/Stock";
import Pengembalian from "./pages/transaksi/Pengembalian";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Login Page */}
        <Route path="/login" element={<LoginForm />} />

        {/* Rekap Page */}
        <Route path="/rekap" element={<Rekap />} />

        {/* Stock Page */}
        <Route path="/stock" element={<Stock />} />

        {/* Admin Pages with Layout */}
        <Route path="/Transaksi" element={<TransaksiLayout/>}>
          <Route path="pembelian" element={<Pembelian />} />
          <Route path="penjualan" element={<Penjualan />} />
          <Route path="pengembalian" element={<Pengembalian />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;