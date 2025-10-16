import React, { useEffect, useState, useCallback } from "react";
// --- BARU: Tambahkan BiRefresh dan BiLoaderAlt untuk tombol ---
import {BiCube, BiRefresh, BiLoaderAlt } from "react-icons/bi"; 
import "../../../style/stok/stok.css";

// --- Konfigurasi ---
const ITEMS_PER_PAGE = 10;
const BASE_URL = import.meta.env.VITE_BASE_URL;
const DEBOUNCE_DELAY = 300; 

// --- Definisi Tipe Data (Interfaces) ---
interface StokItem {
  Kode_Item: number;
  Nama_Item: string;
  Total_Stok_Akhir: number;
  Total_Jumlah_Beli: number;
  Total_Jumlah_Jual: number;
  Total_Jumlah_Retur: number;
}
interface ApiResponse {
  success: boolean;
  currentPage: number;
  totalPages: number;
  totalData: number;
  data: StokItem[];
}

// --- Custom Hook untuk Debouncing ---
const useDebounce = (value: string, delay: number): string => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

// --- Komponen Utama ---
const StockTable: React.FC = () => {
  // --- State Management ---
  const [data, setData] = useState<StokItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, DEBOUNCE_DELAY);
  const [sortBy, setSortBy] = useState("Nama_Item");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  
  // --- BARU: State untuk Tombol Refresh ---
  const [isRefreshing, setIsRefreshing] = useState(false);

  // --- Logika Pengambilan Data ---
  const fetchData = useCallback(async () => {
    // Jangan set loading jika ini adalah refresh dari tombol
    if (!isRefreshing) setLoading(true); 
    setError(null);

    const params = new URLSearchParams({
      page: String(currentPage),
      limit: String(ITEMS_PER_PAGE),
      search: debouncedSearchTerm,
      sortBy: sortBy,
      order: order,
    });

    try {
      const response = await fetch(`${BASE_URL}/api/stok/total?${params.toString()}`);
      if (!response.ok) throw new Error(`Gagal mengambil data. Status: ${response.status}`);
      
      const json: ApiResponse = await response.json();
      if (!json.success) throw new Error("Respon dari API menandakan kegagalan.");

      setData(json.data);
      setCurrentPage(json.currentPage);
      setTotalPages(json.totalPages);
    } catch (err: unknown) {
      console.error("❌ Terjadi Error:", err);
      let errorMessage = "Terjadi kesalahan saat memuat data.";
      if (err instanceof Error) errorMessage = err.message;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm, sortBy, order, isRefreshing]);

  // --- BARU: Logika Tombol Refresh ---
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch(`${BASE_URL}/api/stok/refresh`, { method: 'POST' });
      if (!response.ok) throw new Error('Gagal me-refresh data');
      alert('Data stok berhasil di-refresh!');
      await fetchData(); // Muat ulang data tabel setelah refresh berhasil
    } catch (error) {
      console.error("Gagal refresh:", error);
      alert('Terjadi kesalahan saat me-refresh data.');
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchData]);


  // --- Side Effects (useEffect) ---
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (debouncedSearchTerm) setCurrentPage(1);
  }, [debouncedSearchTerm]);

  // --- Event Handlers ---
  const handleSort = (field: string) => {
    const isSameField = sortBy === field;
    const newOrder = isSameField && order === "asc" ? "desc" : "asc";
    setSortBy(field);
    setOrder(newOrder);
    setCurrentPage(1);
  };

  // --- Helper untuk Render ---
  const getSortIndicator = (field: string) => {
    if (sortBy === field) return order === "asc" ? " ▲" : " ▼";
    return null;
  };
  
  const renderContent = () => {
    if (loading) return <div className="status-message">🔄 Memuat data...</div>;
    if (error) return <div className="status-message error">🚫 {error}</div>;
    if (data.length === 0) return <div className="status-message">🤷 Tidak ada data stok yang ditemukan.</div>;
    
    return (
      <>
        <div className="table-wrapper">
          <table className="stock-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("Kode_Item")}>Kode Item<span className="sort-indicator">{getSortIndicator("Kode_Item")}</span></th>
                <th onClick={() => handleSort("Nama_Item")}>Nama Item<span className="sort-indicator">{getSortIndicator("Nama_Item")}</span></th>
                <th onClick={() => handleSort("Total_Stok_Akhir")}>Stok Akhir<span className="sort-indicator">{getSortIndicator("Total_Stok_Akhir")}</span></th>
                <th onClick={() => handleSort("Total_Jumlah_Beli")}>Total Beli<span className="sort-indicator">{getSortIndicator("Total_Jumlah_Beli")}</span></th>
                <th onClick={() => handleSort("Total_Jumlah_Jual")}>Total Jual<span className="sort-indicator">{getSortIndicator("Total_Jumlah_Jual")}</span></th>
                <th onClick={() => handleSort("Total_Jumlah_Retur")}>Total Retur<span className="sort-indicator">{getSortIndicator("Total_Jumlah_Retur")}</span></th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.Kode_Item}>
                  <td>{item.Kode_Item}</td>
                  <td>{item.Nama_Item}</td>
                  <td className={item.Total_Stok_Akhir < 0 ? 'stock-negative' : ''}>{item.Total_Stok_Akhir}</td>
                  <td>{item.Total_Jumlah_Beli}</td>
                  <td>{item.Total_Jumlah_Jual}</td>
                  <td>{item.Total_Jumlah_Retur}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="pagination">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
              ⬅️ Sebelumnya
            </button>
            <span>Halaman {currentPage} dari {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
              Selanjutnya ➡️
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="stock-container">
      <h2 className="stock-title"><BiCube /> Tabel Total Stok Barang</h2>
      
      {/* --- BARU: Kontainer untuk Search dan Refresh --- */}
      <div className="controls-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Cari nama atau kode item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <button className="refresh-button" onClick={handleRefresh} disabled={isRefreshing || loading}>
          {isRefreshing ? <BiLoaderAlt className="spinner" /> : <BiRefresh />}
          <span>{isRefreshing ? "Refreshing..." : "Refresh Data"}</span>
        </button>
      </div>

      {renderContent()}
    </div>
  );
};

export default StockTable;