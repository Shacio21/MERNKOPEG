import React, { useState } from "react";
import "../../../style/Transaksi/pembelian.css";

interface FilterProps {
  onFilterChange: (sortBy: string, order: string, bulan?: string) => void;
}

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [sortBy, setSortBy] = useState("Nama_Item");
  const [order, setOrder] = useState("asc");
  const [selectedBulan, setSelectedBulan] = useState("");

  const bulanOptions = [
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

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(sortBy, order, selectedBulan);
  };

  const handleReset = () => {
    setSortBy("Nama_Item");
    setOrder("asc");
    setSelectedBulan("");
    onFilterChange("Nama_Item", "asc", "");
  };

  return (
    <form className="filter-form" onSubmit={handleApply}>
      {/* Pilihan Urutkan */}
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
              setSelectedBulan("");
            }
          }}
        >
          <option value="Nama_Item">Nama Item (A - Z)</option>
          <option value="Total_Harga">Harga</option>
          <option value="Bulan">Bulan</option>
        </select>
      </label>

      {/* Filter tambahan untuk harga */}
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

      {/* Filter tambahan untuk bulan */}
      {sortBy === "Bulan" && (
        <label className="filter-label">
          Pilih Bulan:
          <select
            className="filter-select"
            value={selectedBulan}
            onChange={(e) => setSelectedBulan(e.target.value)}
          >
            <option value="">-- Pilih Bulan --</option>
            {bulanOptions.map((bulan) => (
              <option key={bulan} value={bulan}>
                {bulan}
              </option>
            ))}
          </select>
        </label>
      )}

      {/* Tombol Aksi */}
      <div className="filter-button-group">
        <button type="submit" className="filter-btn">
          Terapkan
        </button>
        <button
          type="button"
          className="filter-btn reset-btn"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </form>
  );
};

export default Filter;
