import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingpage";
import LoginForm from "./components/login/LoginForm";
import TransaksiLayout from "./components/transaksi/TransaksiLayout";
import Pembelian from "./pages/transaksi/Pembelian";
import Penjualan from "./pages/transaksi/Penjualan";
import Rekap from "./pages/Rekap";
import Stok from "./pages/stok/StokTotal";
import StokLayout from "./components/stok/TransaksiLayout";
import StockTable from "./components/stok/total/StokTable";
import StockOpname from "./components/stok/bulanan/StokOpname";

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
        <Route path="/stok" element={<Stok />} />
        {/* Admin Pages with Layout */}
        <Route path="/Stok" element={<StokLayout/>}>
          <Route path="total" element={<StockTable />} />
          <Route path="bulanan" element={<StockOpname />} />
        </Route>

        {/* Admin Pages with Layout */}
        <Route path="/Transaksi" element={<TransaksiLayout/>}>
          <Route path="pembelian" element={<Pembelian />} />
          <Route path="penjualan" element={<Penjualan />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;