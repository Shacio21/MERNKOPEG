import React, { useEffect, useState } from "react";
import "../../../style/Transaksi/pembelian.css";
import Pagination from "../pembelian/Pagination";
import AddPengembalian from "./AddPengembalian";
import UpdatePengembalian from "./UpdatePengembalian";
import AddCsvPengembalian from "./AddCsvPengembalian";
import Filter from "../pembelian/Filter";

const ITEMS_PER_PAGE = 10;
const BASE_URL = import.meta.env.VITE_BASE_URL;

interface PengembalianItem {
  _id: string;
  No: number;
  Kode_Item: string;
  Nama_Item: string;
  Jml: number;
  Satuan: string;
  Harga: number;
  ["Pot. %"]: number;
  Total_Harga: number;
  Bulan: string;
  Tahun: number;
}

interface ApiResponse {
  success: boolean;
  currentPage: number;
  totalPages: number;
  totalData: number;
  data: PengembalianItem[];
}

const PengembalianTable: React.FC = () => {
  const [data, setData] = useState<PengembalianItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // Data yang dipilih untuk edit
  const [selectedData, setSelectedData] = useState<PengembalianItem | null>(
    null
  );

  // Sorting/filter
  const [sortBy, setSortBy] = useState("Kode_Item");
  const [order, setOrder] = useState("asc");

  // ✅ Fetch data API
  const fetchData = async (page: number, searchTerm: string = "") => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${BASE_URL}/api/pengembalian?page=${page}&limit=${ITEMS_PER_PAGE}&search=${encodeURIComponent(
          searchTerm
        )}&sortBy=${sortBy}&order=${order}`,
        { headers: { Accept: "application/json" } }
      );

      const text = await res.text();
      console.log("📡 Raw API Response (Pengembalian):", text);
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
      const res = await fetch(`${BASE_URL}/api/pengembalian`, {
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

  // ✏️ Update data
  const handleUpdateSubmit = async (updatedData: PengembalianItem) => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/pengembalian/${updatedData._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        }
      );
      const json = await res.json();
      if (json.success) {
        setShowUpdateModal(false);
        setSelectedData(null);
        fetchData(currentPage);
      } else {
        alert("Gagal update data");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat update");
    }
  };

  // 🗑️ Delete data
  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus data ini?")) return;
    try {
      const res = await fetch(`${BASE_URL}/api/pengembalian/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        fetchData(currentPage);
      } else {
        alert("Gagal menghapus data");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menghapus");
    }
  };

  // 🧭 Filter/sort
  const handleFilterChange = (newSortBy: string, newOrder: string) => {
    setSortBy(newSortBy);
    setOrder(newOrder);
    setCurrentPage(1);
    fetchData(1, search);
  };

  // 📤 Export CSV
  const handleExportCSV = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/pengembalian/export-csv`);
      if (!res.ok) throw new Error("Gagal export CSV");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "pengembalian_export.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat export CSV");
    }
  };

  useEffect(() => {
    fetchData(currentPage, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  return (
    <div className="pembelian-container">
      <h2 className="pembelian-title">Tabel Pengembalian</h2>

      {/* 🔍 Search */}
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

      {/* 🧭 Filter */}
      <div className="filter-section">
        <Filter onFilterChange={handleFilterChange} />
      </div>

      {/* ✅ Tombol tambah, CSV, Export */}
      <div className="table-header">
        <button className="add-btn" onClick={() => setShowAddModal(true)}>
          + Tambah Pengembalian
        </button>
        <div className="csv-btn-group">
          <button className="csv-btn" onClick={() => setShowCsvModal(true)}>
            Upload CSV
          </button>
          <button className="export-btn" onClick={handleExportCSV}>
            Export CSV
          </button>
        </div>
      </div>

      {/* 📊 Tabel */}
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
                <th>No</th>
                <th>Kode Item</th>
                <th>Nama Item</th>
                <th>Jumlah</th>
                <th>Satuan</th>
                <th>Harga (Rp)</th>
                <th>Pot. %</th>
                <th>Total Harga (Rp)</th>
                <th>Bulan</th>
                <th>Tahun</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item._id}>
                  <td>{item.No}</td>
                  <td>{item.Kode_Item}</td>
                  <td>{item.Nama_Item}</td>
                  <td>{item.Jml}</td>
                  <td>{item.Satuan}</td>
                  <td>Rp {item.Harga.toLocaleString("id-ID")}</td>
                  <td>{item["Pot. %"]}</td>
                  <td>Rp {item.Total_Harga.toLocaleString("id-ID")}</td>
                  <td>{item.Bulan}</td>
                  <td>{item.Tahun}</td>
                  <td className="action-cell">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => {
                        setSelectedData(item);
                        setShowUpdateModal(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(item._id)}
                    >
                      Hapus
                    </button>
                  </td>
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

      {/* Modal Tambah */}
      {showAddModal && (
        <AddPengembalian
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddSubmit}
        />
      )}

      {/* Modal Update */}
      {showUpdateModal && selectedData && (
        <UpdatePengembalian
          data={selectedData}
          onClose={() => setShowUpdateModal(false)}
          onSubmit={handleUpdateSubmit}
        />
      )}

      {/* Modal CSV */}
      {showCsvModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowCsvModal(false)}>
              ✖
            </button>
            <AddCsvPengembalian />
            <button
              className="refresh-btn"
              onClick={() => fetchData(currentPage)}
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

export default PengembalianTable;
