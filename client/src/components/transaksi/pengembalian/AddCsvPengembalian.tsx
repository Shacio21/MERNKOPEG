import React, { useState } from "react";
import "../../../style/Transaksi/pembelian.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface AddCsvPengembalianProps {
  onClose: () => void; // 🟢 Tambah prop untuk tombol Batal
}

const AddCsvPengembalian: React.FC<AddCsvPengembalianProps> = ({ onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setMessage(null);
      setError(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError("Pilih file CSV terlebih dahulu.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      setError(null);
      setMessage(null);

      const res = await fetch(`${BASE_URL}/api/pembelian/upload-csv`, {
        method: "POST",
        body: formData,
      });

      const text = await res.text();
      console.log("📡 Raw API Response (CSV Upload):", text);

      const json = JSON.parse(text);

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Gagal mengupload CSV");
      }

      setMessage("✅ File CSV berhasil diupload dan diproses ke database.");
      setFile(null);
      (document.getElementById("csv-input") as HTMLInputElement).value = "";
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat upload CSV");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="csv-container">
      <h2 className="csv-title">Upload CSV Pengembalian</h2>

      <form onSubmit={handleUpload} className="csv-form">
        <input
          type="file"
          id="csv-input"
          accept=".csv"
          onChange={handleFileChange}
          className="csv-input"
        />

        <div className="csv-btn-group">
          <button type="submit" className="csv-btn" disabled={uploading}>
            {uploading ? "Mengupload..." : "Upload"}
          </button>

          {/* 🟢 Tombol batal */}
          <button
            type="button"
            className="csv-btn-cancel"
            onClick={onClose}
            disabled={uploading}
          >
            Batal
          </button>
        </div>
      </form>

      {message && <p className="csv-message success">{message}</p>}
      {error && <p className="csv-message error">{error}</p>}

      <div className="csv-info">
        <p>📌 Pastikan format CSV sesuai dengan kolom database:</p>
        <ul>
          <li>No</li>
          <li>Kode Item</li>
          <li>Nama Item</li>
          <li>Jumlah</li>
          <li>Satuan</li>
          <li>Harga (Rp)</li>
          <li>Pot. %</li>
          <li>Total Harga (Rp)</li>
          <li>Bulan</li>
          <li>Tahun</li>
        </ul>
      </div>
    </div>
  );
};

export default AddCsvPengembalian;
