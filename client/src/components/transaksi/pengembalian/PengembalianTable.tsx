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
    const [selectedData, setSelectedData] = useState<PengembalianItem | null>(null);

  // Sorting/filter
  const [sortBy, setSortBy] = useState("Kode_Item");
  const [order, setOrder] = useState("asc");
  const [bulan, setBulanFilter] = useState<string>(""); // 🟡 Tambahan
  const [tahun, setTahunFilter] = useState<number>(2025); // 🟢 Diperbaiki, tambahkan setter


  // ✅ Fetch data API dengan filter
  const fetchData = async (page: number, searchTerm: string = "") => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", ITEMS_PER_PAGE.toString());
      params.append("search", searchTerm);
      params.append("sortBy", sortBy);
      params.append("order", order);
      if (bulan) params.append("bulan", bulan);
      if (tahun) params.append("tahun", tahun.toString());

      const res = await fetch(`${BASE_URL}/api/pengembalian?${params.toString()}`, {
        headers: { Accept: "application/json" },
      });

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
  const handleFilterChange = (
    newSortBy: string,
    newOrder: string,
    selectedBulan?: string,
    selectedTahun?: string
  ) => {
    setSortBy(newSortBy);
    setOrder(newOrder);
    setBulanFilter(selectedBulan || "");

    // 🟢 Perbaiki baris ini:
    setTahunFilter(selectedTahun ? parseInt(selectedTahun) : 2025);

    setCurrentPage(1);
    fetchData(1, search);
  };

  //ceklis tabel 
// ✅ State untuk menyimpan baris yang dicentang
const [selectedRows, setSelectedRows] = useState<string[]>([]);

// ✅ Fungsi untuk toggle baris
const toggleSelectRow = (id: string) => {
  setSelectedRows((prev) =>
    prev.includes(id)
      ? prev.filter((itemId) => itemId !== id)
      : [...prev, id]
  );
};

  // 📤 Export CSV
  const handleExportCSV = async () => {
    try {
      let query = "";

      if (bulan && tahun) {
        query = `?bulan=${bulan}&tahun=${tahun}`;
      } else if (tahun) {
        query = `?tahun=${tahun}`;
      }

      const res = await fetch(`${BASE_URL}/api/pengembalian/export-csv${query}`);
      if (!res.ok) throw new Error("Gagal export CSV");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      // Nama file dinamis berdasarkan filter
      const fileName =
        bulan && tahun
          ? `pengembalian_${bulan}_${tahun}.csv`
          : tahun
          ? `pengembalian_${tahun}.csv`
          : "pengembalian_export.csv";

      a.download = fileName;
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
        <div className="csv-btn-group">
          <button className="csv-btn" onClick={() => setShowCsvModal(true)}>
            Upload CSV
          </button>

          {/* 🔽 Filter bulan dan tahun sebelum export */}
          <select
            value={bulan}
            onChange={(e) => setBulanFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">Semua Bulan</option>
            <option value="Januari">Januari</option>
            <option value="Februari">Februari</option>
            <option value="Maret">Maret</option>
            <option value="April">April</option>
            <option value="Mei">Mei</option>
            <option value="Juni">Juni</option>
            <option value="Juli">Juli</option>
            <option value="Agustus">Agustus</option>
            <option value="September">September</option>
            <option value="Oktober">Oktober</option>
            <option value="November">November</option>
            <option value="Desember">Desember</option>
          </select>

          <select
            value={tahun}
            onChange={(e) => setTahunFilter(parseInt(e.target.value))}
            className="filter-select"
          >
            <option value="">Semua Tahun</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>

          <button className="export-btn" onClick={handleExportCSV}>
            Export CSV
          </button>
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
                <th></th>
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
              {data.map((item) => {
                const isSelected = selectedRows.includes(item._id);
                return (
                  <tr
                    key={item._id}
                    style={{
                      backgroundColor: isSelected ? "#d4fcd4" : "transparent",
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
                    <td>{item.No}</td>
                    <td>{item.Kode_Item}</td>
                    <td>{item.Nama_Item}</td>
                    <td>{item.Jml}</td>
                    <td>{item.Satuan}</td>
                    <td>{item.Harga.toLocaleString()}</td>
                    <td>{item["Pot. %"]}</td>
                    <td>{item.Total_Harga.toLocaleString()}</td>
                    <td>{item.Bulan}</td>
                    <td>{item.Tahun}</td>
                    <td>
                      <button 
                         className="action-btn edit-btn" onClick={() => {
                        setSelectedData(item);
                        setShowUpdateModal(true);
                      }}>
                        Edit
                      </button>
                      <button className="action-btn delete-btn"  onClick={() => handleDelete(item._id)}>Hapus</button>
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
            {/* 🟢 Tambahkan prop onClose */}
            <AddCsvPengembalian onClose={() => setShowCsvModal(false)} />

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
