import React, { useState, useCallback } from "react";
import "../../../style/stok/stok.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface PerbedaanItem {
  Kode_Item: string;
  Nama_Item: string;
  Bulan: string;
  Tahun: string;
  CSV: {
    Jumlah_Beli: string;
    Jumlah_Jual: string;
    Jumlah_Retur: string;
    Stok_Akhir: string;
  };
  DB: {
    Jumlah_Beli: number;
    Jumlah_Jual: number;
    Jumlah_Retur: number;
    Stok_Akhir: number;
  };
}

const StokOpname: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  // 🔹 state baru untuk menyimpan data perbedaan dari API
  const [perbedaan, setPerbedaan] = useState<PerbedaanItem[] | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(null);
    setIsError(false);
    setPerbedaan(null); // 🔹 reset data perbedaan tiap kali file diganti

    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.type !== "text/csv") {
        setMessage("File tidak valid. Harap pilih file dengan format .csv");
        setIsError(true);
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (!selectedFile) {
        setMessage("Tidak ada file yang dipilih. Silakan pilih file terlebih dahulu.");
        setIsError(true);
        return;
      }

      setUploading(true);
      setMessage("Mengunggah file...");
      setIsError(false);
      setPerbedaan(null); // 🔹 kosongkan hasil sebelumnya

      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const response = await fetch(`${BASE_URL}/api/stok/stok-opname`, {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Gagal mengunggah file.");
        }

        // 🔹 Jika respons berisi field "perbedaan", simpan ke state
        if (result.perbedaan && Array.isArray(result.perbedaan)) {
          setMessage(result.message || "Ditemukan perbedaan data stok!");
          setPerbedaan(result.perbedaan);
          setIsError(false);
        } else {
          setMessage(result.message || "File berhasil diunggah dan diproses!");
          setIsError(false);
          setPerbedaan(null);
        }

        setSelectedFile(null);
      } catch (err: unknown) {
        console.error("❌ Terjadi Error:", err);
        let errorMessage = "Terjadi kesalahan pada server.";
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        setMessage(errorMessage);
        setIsError(true);
      } finally {
        setUploading(false);
      }
    },
    [selectedFile]
  );

  return (
    <div className="stock-container">
      <h2 className="stock-title">📦 Import Stok Opname (CSV)</h2>

      <div className="upload-wrapper">
        <p className="upload-description">
          Pilih file CSV hasil stok opname Anda untuk diimpor ke dalam sistem.
          Pastikan format kolom pada file CSV sudah sesuai dengan template yang ditentukan.
        </p>

        <form onSubmit={handleSubmit} className="upload-form">
          <label htmlFor="csv-upload" className="upload-label">
            {selectedFile ? `✔️ ${selectedFile.name}` : "📁 Pilih File CSV"}
          </label>
          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={uploading}
            style={{ display: "none" }}
          />

          <button
            type="submit"
            className="upload-button"
            disabled={!selectedFile || uploading}
          >
            {uploading ? "Memproses..." : "Upload dan Proses"}
          </button>
        </form>

        {message && (
          <div className={`upload-status ${isError ? "error" : "success"}`}>
            {message}
          </div>
        )}

        {/* 🔹 Tampilkan tabel perbedaan jika ada */}
        {perbedaan && perbedaan.length > 0 && (
          <div className="perbedaan-wrapper">
            <h3>🔍 Detail Perbedaan Stok</h3>
            <table className="perbedaan-table">
              <thead>
                <tr>
                  <th>Kode Item</th>
                  <th>Nama Item</th>
                  <th>Bulan</th>
                  <th>Tahun</th>
                  <th>CSV - Jumlah Beli</th>
                  <th>DB - Jumlah Beli</th>
                  <th>CSV - Jumlah Jual</th>
                  <th>DB - Jumlah Jual</th>
                  <th>CSV - Retur</th>
                  <th>DB - Retur</th>
                  <th>CSV - Stok Akhir</th>
                  <th>DB - Stok Akhir</th>
                </tr>
              </thead>
              <tbody>
                {perbedaan.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.Kode_Item}</td>
                    <td>{item.Nama_Item}</td>
                    <td>{item.Bulan}</td>
                    <td>{item.Tahun}</td>
                    <td>{item.CSV.Jumlah_Beli}</td>
                    <td>{item.DB.Jumlah_Beli}</td>
                    <td>{item.CSV.Jumlah_Jual}</td>
                    <td>{item.DB.Jumlah_Jual}</td>
                    <td>{item.CSV.Jumlah_Retur}</td>
                    <td>{item.DB.Jumlah_Retur}</td>
                    <td>{item.CSV.Stok_Akhir}</td>
                    <td>{item.DB.Stok_Akhir}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StokOpname;
