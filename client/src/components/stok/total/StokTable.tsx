import React, { useEffect, useState, useCallback } from "react";
import { BiCube, BiRefresh, BiLoaderAlt, BiDownload } from "react-icons/bi";
import "../../../style/stok/stok.css";

const ITEMS_PER_PAGE = 10;
const BASE_URL = import.meta.env.VITE_BASE_URL;
const DEBOUNCE_DELAY = 300;

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

const useDebounce = (value: string, delay: number): string => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const StockTable: React.FC = () => {
  const [data, setData] = useState<StokItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, DEBOUNCE_DELAY);
  const [sortBy, setSortBy] = useState("Nama_Item");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Tambahkan opsi "all"
  const [bulan, setBulan] = useState("all");
  const [tahun, setTahun] = useState("all");

  const fetchData = useCallback(async () => {
    if (!isRefreshing) setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      page: String(currentPage),
      limit: String(ITEMS_PER_PAGE),
      search: debouncedSearchTerm,
      sortBy,
      order,
    });

    // hanya tambahkan bulan/tahun jika bukan "all"
    if (bulan !== "all") params.append("bulan", bulan);
    if (tahun !== "all") params.append("tahun", tahun);

    try {
      const response = await fetch(`${BASE_URL}/api/stok?${params.toString()}`);
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
  }, [currentPage, debouncedSearchTerm, sortBy, order, bulan, tahun, isRefreshing]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch(`${BASE_URL}/api/stok/refresh`, { method: "POST" });
      if (!response.ok) throw new Error("Gagal me-refresh data");
      alert("Data stok berhasil di-refresh!");
      await fetchData();
    } catch (error) {
      console.error("Gagal refresh:", error);
      alert("Terjadi kesalahan saat me-refresh data.");
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchData]);

  const handleExportCSV = useCallback(async () => {
    setIsExporting(true);
    try {
      const params = new URLSearchParams();
      if (bulan !== "all") params.append("bulan", bulan);
      if (tahun !== "all") params.append("tahun", tahun);

      const response = await fetch(`${BASE_URL}/api/stok/export-csv?${params.toString()}`);

      if (!response.ok) throw new Error("Gagal mengekspor CSV.");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `stok_${bulan === "all" ? "semua" : bulan}_${tahun === "all" ? "semua" : tahun}.csv`;
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Gagal export CSV:", error);
      alert("Terjadi kesalahan saat mengekspor data ke CSV.");
    } finally {
      setIsExporting(false);
    }
  }, [bulan, tahun]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (debouncedSearchTerm) setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const handleSort = (field: string) => {
    const isSameField = sortBy === field;
    const newOrder = isSameField && order === "asc" ? "desc" : "asc";
    setSortBy(field);
    setOrder(newOrder);
    setCurrentPage(1);
  };

  const getSortIndicator = (field: string) => {
    if (sortBy === field) return order === "asc" ? " ▲" : " ▼";
    return null;
  };

  const bulanList = [
    { value: "all", label: "Semua Bulan" },
    { value: "januari", label: "Januari" },
    { value: "februari", label: "Februari" },
    { value: "maret", label: "Maret" },
    { value: "april", label: "April" },
    { value: "mei", label: "Mei" },
    { value: "juni", label: "Juni" },
    { value: "juli", label: "Juli" },
    { value: "agustus", label: "Agustus" },
    { value: "september", label: "September" },
    { value: "oktober", label: "Oktober" },
    { value: "november", label: "November" },
    { value: "desember", label: "Desember" },
  ];

  const tahunList = [
    { value: "all", label: "Semua Tahun" },
    { value: "2023", label: "2023" },
    { value: "2024", label: "2024" },
    { value: "2025", label: "2025" },
    { value: "2026", label: "2026" },
  ];

  return (
    <div className="stock-container">
      <h2 className="stock-title"><BiCube /> Tabel Total Stok Barang</h2>

      <div className="controls-container">
        <div className="filters">
          <select value={bulan} onChange={(e) => setBulan(e.target.value)} className="filter-select">
            {bulanList.map((b) => (
              <option key={b.value} value={b.value}>{b.label}</option>
            ))}
          </select>

          <select value={tahun} onChange={(e) => setTahun(e.target.value)} className="filter-select">
            {tahunList.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div className="search-container">
          <input
            type="text"
            placeholder="Cari nama atau kode item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="button-group">
          <button className="refresh-button" onClick={handleRefresh} disabled={isRefreshing || loading}>
            {isRefreshing ? <BiLoaderAlt className="spinner" /> : <BiRefresh />}
            <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
          </button>

          <button className="export-button" onClick={handleExportCSV} disabled={isExporting}>
            {isExporting ? <BiLoaderAlt className="spinner" /> : <BiDownload />}
            <span>{isExporting ? "Exporting..." : "Export CSV"}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="status-message">🔄 Memuat data...</div>
      ) : error ? (
        <div className="status-message error">🚫 {error}</div>
      ) : data.length === 0 ? (
        <div className="status-message">🤷 Tidak ada data stok yang ditemukan.</div>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="stock-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort("Kode_Item")}>
                    Kode Item<span className="sort-indicator">{getSortIndicator("Kode_Item")}</span>
                  </th>
                  <th onClick={() => handleSort("Nama_Item")}>
                    Nama Item<span className="sort-indicator">{getSortIndicator("Nama_Item")}</span>
                  </th>
                  <th onClick={() => handleSort("Total_Stok_Akhir")}>
                    Stok Akhir<span className="sort-indicator">{getSortIndicator("Total_Stok_Akhir")}</span>
                  </th>
                  <th onClick={() => handleSort("Total_Jumlah_Beli")}>
                    Total Beli<span className="sort-indicator">{getSortIndicator("Total_Jumlah_Beli")}</span>
                  </th>
                  <th onClick={() => handleSort("Total_Jumlah_Jual")}>
                    Total Jual<span className="sort-indicator">{getSortIndicator("Total_Jumlah_Jual")}</span>
                  </th>
                  <th onClick={() => handleSort("Total_Jumlah_Retur")}>
                    Total Retur<span className="sort-indicator">{getSortIndicator("Total_Jumlah_Retur")}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.Kode_Item}>
                    <td>{item.Kode_Item}</td>
                    <td>{item.Nama_Item}</td>
                    <td className={item.Total_Stok_Akhir < 0 ? "stock-negative" : ""}>
                      {item.Total_Stok_Akhir}
                    </td>
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
              <span>
                Halaman {currentPage} dari {totalPages}
              </span>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
                Selanjutnya ➡️
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StockTable;
