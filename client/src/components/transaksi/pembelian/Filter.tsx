import React, { useState } from "react";
import "../../../style/Transaksi/pembelian.css";

interface FilterProps {
  onFilterChange: (sortBy: string, order: string) => void;
}

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [sortBy, setSortBy] = useState("Nama_Item");
  const [order, setOrder] = useState("asc");

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(sortBy, order);
  };

  const handleReset = () => {
    setSortBy("Nama_Item");
    setOrder("asc");
    onFilterChange("Nama_Item", "asc");
  };

  return (
    <form className="filter-form" onSubmit={handleApply}>
      {/* Pilihan Filter */}
      <label className="filter-label">
        Urutkan:
        <select
          className="filter-select"
          value={sortBy}
          onChange={(e) => {
            const value = e.target.value;
            setSortBy(value);
            if (value === "Nama_Item") setOrder("asc");
            if (value === "Total_Harga") setOrder("asc");
            if (value === "Bulan") setOrder("bulan");
          }}
        >
          <option value="Nama_Item">Nama Item (A - Z)</option>
          <option value="Total_Harga">Harga</option>
          <option value="Bulan">Bulan (Jan - Des)</option>
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
