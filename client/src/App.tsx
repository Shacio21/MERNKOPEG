import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingpage";
import TransaksiLayout from "./components/transaksi/TransaksiLayout";
import Pembelian from "./pages/transaksi/Pembelian";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Admin Pages with Layout */}
        <Route path="/Transaksi" element={<TransaksiLayout/>}>
          <Route path="pembelian" element={<Pembelian />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;