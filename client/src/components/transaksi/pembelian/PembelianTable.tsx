import React, { useEffect, useState } from "react";
import "../../../style/Transaksi/pembelian.css";
import Pagination from "./Pagination";
import AddPembelian from "./AddPembelian";
import AddCsvPembelian from "./AddCsvPembelian";
import Filter from "./Filter";
import UpdatePembelian from "./UpdatePembelian";

const ITEMS_PER_PAGE = 10;
const BASE_URL = import.meta.env.VITE_BASE_URL;

interface PembelianItem {
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
  data: PembelianItem[];
}


const PembelianTable: React.FC = () => {
  const [data, setData] = useState<PembelianItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // Data yang dipilih untuk update
  const [selectedData, setSelectedData] = useState<PembelianItem | null>(null);

  // Filter & Sort state
  const [sortBy, setSortBy] = useState("Kode_Item");
  const [order, setOrder] = useState("asc");
  const [bulanFilter, setBulanFilter] = useState("");
  const [tahunFilter, setTahunFilter] = useState(new Date().getFullYear().toString());

  // ✅ Fetch data dengan parameter lengkap
  const fetchData = async (page: number, searchTerm: string = "") => {
    setLoading(true);
    setError(null);

    try {
      const url = new URL(`${BASE_URL}/api/pembelian`);
      url.searchParams.append("page", page.toString());
      url.searchParams.append("limit", ITEMS_PER_PAGE.toString());
      url.searchParams.append("sortBy", sortBy);
      url.searchParams.append("order", order);
      url.searchParams.append("tahun", tahunFilter);

      if (bulanFilter) {
        url.searchParams.append("bulan", bulanFilter);
      }

      if (searchTerm) {
        url.searchParams.append("search", searchTerm);
      }

      console.log("📡 Fetch URL:", url.toString());

      const res = await fetch(url.toString());
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

  // ➕ Tambah
  const handleAddSubmit = async (newData: any) => {
    try {
      const res = await fetch(`${BASE_URL}/api/pembelian`, {
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

  // ✏️ Update
  const handleUpdateSubmit = async (updatedData: PembelianItem) => {
    try {
      const res = await fetch(`${BASE_URL}/api/pembelian/${updatedData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
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

  // 🗑️ Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus data ini?")) return;
    try {
      const res = await fetch(`${BASE_URL}/api/pembelian/${id}`, {
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
  const handleFilterChange = (
    newSortBy: string,
    newOrder: string,
    selectedBulan?: string
  ) => {
    setSortBy(newSortBy);
    setOrder(newOrder);
    setBulanFilter(selectedBulan || "");
    setCurrentPage(1);
    fetchData(1, search);
  };

  // 📤 Export CSV
  const handleExportCSV = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/pembelian/export-csv`);
      if (!res.ok) throw new Error("Gagal export CSV");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "pembelian_export.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat export CSV");
    }
  };


  //ceklis tabel 
  // ✅ Tambah state di atas
const [selectedRows, setSelectedRows] = useState<string[]>([]);

// ✅ Fungsi toggle checkbox
const toggleSelectRow = (id: string) => {
  setSelectedRows((prev) =>
    prev.includes(id)
      ? prev.filter((itemId) => itemId !== id) // jika sudah ada → hapus
      : [...prev, id] // jika belum → tambahkan
  );
};


  // 📅 Ambil data pertama kali
  useEffect(() => {
    fetchData(currentPage, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  return (
    <div className="pembelian-container">
      <h2 className="pembelian-title">Tabel Pembelian</h2>

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

      {/* 🧭 Filter/Sort */}
      <div className="filter-section">
        <Filter onFilterChange={handleFilterChange} />
      </div>

      {/* ✅ Tombol tambah, CSV, Export */}
      <div className="table-header">
        <button className="add-btn" onClick={() => setShowAddModal(true)}>
          + Tambah Pembelian
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
                <th></th> {/* ✅ Kolom checkbox */}
                <th>Kode Item</th>
                <th>Nama Item</th>
                <th>Jenis</th>
                <th>Jumlah</th>
                <th>Satuan</th>
                <th>Total Harga</th>
                <th>Bulan</th>
                <th>Tahun</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => {
                const isSelected = selectedRows.includes(item._id);
                return (
                  <tr
                    key={item._id}
                    style={{
                      backgroundColor: isSelected ? "#d4fcd4" : "transparent", // ✅ hijau muda
                      transition: "background-color 0.3s ease",
                    }}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(item._id)}
                      />
                    </td>
                    <td>{item.Kode_Item}</td>
                    <td>{item.Nama_Item}</td>
                    <td>{item.Jenis}</td>
                    <td>{item.Jumlah}</td>
                    <td>{item.Satuan}</td>
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
                );
              })}
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
        <AddPembelian
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddSubmit}
        />
      )}

      {/* Modal Update */}
      {showUpdateModal && selectedData && (
        <UpdatePembelian
          data={selectedData}
          onClose={() => setShowUpdateModal(false)}
          onSubmit={handleUpdateSubmit}
        />
      )}

      {/* Modal CSV */}
      {showCsvModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <AddCsvPembelian onClose={() => setShowCsvModal(false)} /> {/* ✅ ini */}
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

export default PembelianTable;
