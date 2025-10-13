import React, { useState } from "react";
import "../../../style/Transaksi/pembelian.css";
import Pagination from "./Pagination";

// === Data yang sudah kamu punya ===
import { data } from "./dataPembelian"; // kamu bisa pisahkan ke file terpisah jika mau

const ITEMS_PER_PAGE = 10;

const PembelianTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="pembelian-container">
      <h2 className="pembelian-title">Tabel Pembelian</h2>

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
          {currentData.map((item, idx) => (
            <tr key={idx}>
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default PembelianTable;
