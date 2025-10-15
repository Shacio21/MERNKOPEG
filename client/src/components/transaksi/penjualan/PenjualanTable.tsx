import React, { useEffect, useState } from "react";
import "../../../style/Transaksi/pembelian.css";
import Pagination from "../pembelian/Pagination";
import AddPembelian from "../pembelian/AddPembelian";
import AddCsvPembelian from "./AddCsvPenjualan";
import Filter from "../pembelian/Filter";

const ITEMS_PER_PAGE = 10;
const BASE_URL = import.meta.env.VITE_BASE_URL;

interface PenjualanItem {
  _id: string;
  Kode_Item: number;
  Nama_Item: string;
  Jenis: string;
  Jumlah: number;
  Satuan: string;
  Total_Harga: number;
  Bulan: string;
  Tahun: number;
}

interface ApiResponse {
  success: boolean;
  currentPage: number;
  totalPages: number;
  totalData: number;
  data: PenjualanItem[];
}

const PenjualanTable: React.FC = () => {
  const [data, setData] = useState<PenjualanItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);

  // Sorting/filter state
  const [sortBy, setSortBy] = useState("Kode_Item");
  const [order, setOrder] = useState("asc");

  // ✅ Fetch data dari API dengan search + sort
  const fetchData = async (page: number, searchTerm: string = "") => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${BASE_URL}/api/penjualan?page=${page}&limit=${ITEMS_PER_PAGE}&search=${encodeURIComponent(
          searchTerm
        )}&sortBy=${sortBy}&order=${order}`,
        {
          headers: { Accept: "application/json" },
        }
      );

      const text = await res.text();
      console.log("📡 Raw API Response:", text);

      const json: ApiResponse = JSON.parse(text);

      if (!json.success) throw new Error("Gagal mengambil data dari server");

      setData(json.data);
      setCurrentPage(json.currentPage);
      setTotalPages(json.totalPages);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat mengambil data");
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Search
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchData(1, search);
  };

  // ➕ Tambah data
  const handleAddSubmit = async (newData: any) => {
    try {
      const res = await fetch(`${BASE_URL}/api/penjualan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
      const json = await res.json();
      if (json.success) {
        setShowAddModal(false);
        fetchData(currentPage);
      } else {
        alert("Gagal menambah data");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan");
    }
  };

  // ⬆️ CSV Upload
  const handleCsvUploaded = () => {
    setShowCsvModal(false);
    fetchData(currentPage);
  };

  // 🧭 Handle filter/sort perubahan
  const handleFilterChange = (newSortBy: string, newOrder: string) => {
    setSortBy(newSortBy);
    setOrder(newOrder);
    setCurrentPage(1);
    fetchData(1, search);
  };

  useEffect(() => {
    fetchData(currentPage, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  return (
    <div className="pembelian-container">
      <h2 className="pembelian-title">Tabel Penjualan</h2>

      {/* 🔍 Search Form */}
      <form onSubmit={handleSearchSubmit} className="search-form">
        <input
          type="text"
          placeholder="Cari berdasarkan nama item..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-btn">
          Cari
        </button>
      </form>

      {/* 🧭 Filter/Sort Section */}
      <div className="filter-section">
        <Filter onFilterChange={handleFilterChange} />
      </div>

      {/* ✅ Tombol tambah & upload CSV */}
      <div className="table-header">
        <button className="add-btn" onClick={() => setShowAddModal(true)}>
          + Tambah Pembelian
        </button>
        <button className="csv-btn" onClick={() => setShowCsvModal(true)}>
          ⬆️ Upload CSV
        </button>
      </div>

      {/* 📊 Tabel Data */}
      {loading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : data.length === 0 ? (
        <p>Tidak ada data.</p>
      ) : (
        <>
          <table className="pembelian-table">
            <thead>
              <tr>
                <th>Kode Item</th>
                <th>Nama Item</th>
                <th>Jenis</th>
                <th>Jumlah</th>
                <th>Satuan</th>
                <th>Total Harga</th>
                <th>Bulan</th>
                <th>Tahun</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item._id}>
                  <td>{item.Kode_Item}</td>
                  <td>{item.Nama_Item}</td>
                  <td>{item.Jenis}</td>
                  <td>{item.Jumlah}</td>
                  <td>{item.Satuan}</td>
                  <td>Rp {item.Total_Harga.toLocaleString("id-ID")}</td>
                  <td>{item.Bulan}</td>
                  <td>{item.Tahun}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </>
      )}

      {/* Modal Tambah Pembelian */}
      {showAddModal && (
        <AddPembelian
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddSubmit}
        />
      )}

      {/* Modal Upload CSV */}
      {showCsvModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowCsvModal(false)}>
              ✖
            </button>
            <AddCsvPembelian />
            <button
              className="refresh-btn"
              onClick={handleCsvUploaded}
              style={{ marginTop: "10px" }}
            >
              🔄 Refresh Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PenjualanTable;
