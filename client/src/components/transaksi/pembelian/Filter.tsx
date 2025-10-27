import React, { useState } from "react";
import "../../../style/Transaksi/pembelian.css";

interface FilterProps {
  onFilterChange: (sortBy: string, order: string, bulan?: string, tahun?: string) => void;
}

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [sortBy, setSortBy] = useState("Nama_Item");
  const [order, setOrder] = useState("asc");
  const [selectedBulan, setSelectedBulan] = useState("");
  const [selectedTahun, setSelectedTahun] = useState("");

  const bulanOptions = [
    "Semua Bulan",
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  // ambil 5 tahun terakhir + tahun ini
  const currentYear = new Date().getFullYear();
  const tahunOptions = Array.from({ length: 6 }, (_, i) => (currentYear - i).toString());
  tahunOptions.unshift("Semua Tahun");

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const bulan = selectedBulan === "Semua Bulan" ? "" : selectedBulan;
    const tahun = selectedTahun === "Semua Tahun" ? "" : selectedTahun;
    onFilterChange(sortBy, order, bulan, tahun);
  };

  const handleReset = () => {
    setSortBy("Nama_Item");
    setOrder("asc");
    setSelectedBulan("");
    setSelectedTahun("");
    onFilterChange("Nama_Item", "asc", "", "");
  };

  return (
    <form className="filter-form" onSubmit={handleApply}>
      {/* Urutkan */}
      <label className="filter-label">
        Urutkan:
        <select
          className="filter-select"
          value={sortBy}
          onChange={(e) => {
            const value = e.target.value;
            setSortBy(value);
            if (value === "Nama_Item" || value === "Total_Harga") {
              setOrder("asc");
            }
          }}
        >
          <option value="Nama_Item">Nama Item (A - Z)</option>
          <option value="Total_Harga">Harga</option>
          <option value="Bulan">Bulan</option>
        </select>
      </label>

      {/* Urutan Harga */}
      {sortBy === "Total_Harga" && (
        <label className="filter-label">
          Urutan Harga:
          <select
            className="filter-select"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
          >
            <option value="asc">Terkecil - Terbesar</option>
            <option value="desc">Terbesar - Terkecil</option>
          </select>
        </label>
      )}

      {/* Filter Bulan */}
      <label className="filter-label">
        Pilih Bulan:
        <select
          className="filter-select"
          value={selectedBulan}
          onChange={(e) => setSelectedBulan(e.target.value)}
        >
          {bulanOptions.map((bulan) => (
            <option key={bulan} value={bulan}>
              {bulan}
            </option>
          ))}
        </select>
      </label>

      {/* Filter Tahun */}
      <label className="filter-label">
        Pilih Tahun:
        <select
          className="filter-select"
          value={selectedTahun}
          onChange={(e) => setSelectedTahun(e.target.value)}
        >
          {tahunOptions.map((tahun) => (
            <option key={tahun} value={tahun}>
              {tahun}
            </option>
          ))}
        </select>
      </label>

      {/* Tombol Aksi */}
      <div className="filter-button-group">
        <button type="submit" className="filter-btn">
          Terapkan
        </button>
        <button type="button" className="filter-btn reset-btn" onClick={handleReset}>
          Reset
        </button>
      </div>
    </form>
  );
};

export default Filter;
