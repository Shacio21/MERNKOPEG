import React, { useEffect, useState } from "react";
import "../../style/Transaksi/pembelian.css"; 

const ITEMS_PER_PAGE = 10;
const BASE_URL = "http://127.0.0.1:3001";

// ✅ Struktur data dari API stok total
interface StokItem {
  Nama_Item: string;
  Total_Stok_Akhir: number;
  Total_Jumlah_Beli: number;
  Total_Jumlah_Jual: number;
  Total_Jumlah_Retur: number;
  Kode_Item: number;
}

interface ApiResponse {
  success: boolean;
  currentPage: number;
  totalPages: number
  totalData: number;
  data: StokItem[];
}

const TableStock: React.FC = () => {
  const [data, setData] = useState<StokItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [sortBy, setSortBy] = useState("Nama_Item");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  // ✅ Fetch data stok dari API
  const fetchData = async (page: number, searchTerm: string = "") => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${BASE_URL}/api/stok/total?page=${page}&limit=${ITEMS_PER_PAGE}&search=${encodeURIComponent(
          searchTerm
        )}&sortBy=${sortBy}&order=${order}`
      );

      const text = await res.text();
      console.log("📡 Raw API Response:", text);

      const json: ApiResponse = JSON.parse(text);

      if (!json.success) throw new Error("Gagal mengambil data dari server");

      setData(json.data);
      setCurrentPage(json.currentPage);
      setTotalPages(json.totalPages);
    } catch (err: any) {
      console.error("❌ Error:", err);
      setError(err.message || "Terjadi kesalahan saat mengambil data");
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Pencarian
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchData(1, search);
  };

  // 🔁 Ganti urutan sort
  const handleSort = (field: string) => {
    const newOrder = sortBy === field && order === "asc" ? "desc" : "asc";
    setSortBy(field);
    setOrder(newOrder);
    fetchData(currentPage, search);
  };

  useEffect(() => {
    fetchData(currentPage, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  return (
    <div className="stock-container">
      <h2 className="stock-title">📦 Tabel Total Stok Barang</h2>

      {/* 🔍 Search Bar */}
      <form onSubmit={handleSearchSubmit} className="search-form">
        <input
          type="text"
          placeholder="Cari nama item..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-btn">
          Cari
        </button>
      </form>

      {/* 📊 Tabel Stok */}
      {loading ? (
        <p>Memuat data...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : data.length === 0 ? (
        <p>Tidak ada data stok.</p>
      ) : (
        <>
          <table className="stock-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("Kode_Item")}>Kode Item</th>
                <th onClick={() => handleSort("Nama_Item")}>Nama Item</th>
                <th onClick={() => handleSort("Total_Stok_Akhir")}>Total Stok Akhir</th>
                <th onClick={() => handleSort("Total_Jumlah_Beli")}>Total Jumlah Beli</th>
                <th onClick={() => handleSort("Total_Jumlah_Jual")}>Total Jumlah Jual</th>
                <th onClick={() => handleSort("Total_Jumlah_Retur")}>Total Jumlah Retur</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.Kode_Item}</td>
                  <td>{item.Nama_Item}</td>
                  <td>{item.Total_Stok_Akhir}</td>
                  <td>{item.Total_Jumlah_Beli}</td>
                  <td>{item.Total_Jumlah_Jual}</td>
                  <td>{item.Total_Jumlah_Retur}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 📄 Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                ⬅️ Sebelumnya
              </button>
              <span>
                Halaman {currentPage} dari {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Selanjutnya ➡️
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TableStock;
