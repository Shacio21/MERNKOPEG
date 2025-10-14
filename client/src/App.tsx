import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingpage";
import LoginForm from "./components/login/LoginForm";
import TransaksiLayout from "./components/transaksi/TransaksiLayout";
import Pembelian from "./pages/transaksi/Pembelian";
import Rekap from "./pages/Rekap";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Login Page */}
        <Route path="/login" element={<LoginForm />} />

        {/* Login Page */}
        <Route path="/rekap" element={<Rekap />} />

        {/* Admin Pages with Layout */}
        <Route path="/Transaksi" element={<TransaksiLayout/>}>
          <Route path="pembelian" element={<Pembelian />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;