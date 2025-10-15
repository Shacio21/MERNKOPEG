import React, { useState, useCallback } from "react";
// Pastikan path CSS ini sesuai dengan struktur proyek Anda
import "../../../style/stok/stok.css"; 

// --- Konfigurasi ---
const BASE_URL = import.meta.env.VITE_BASE_URL;

// --- Komponen Utama untuk Stok Opname ---
const StokOpname: React.FC = () => {
  // --- State Management ---
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  // --- Event Handlers ---
  /**
   * Menangani pemilihan file dari input.
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Reset pesan setiap kali file baru dipilih
    setMessage(null);
    setIsError(false);

    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      // Validasi sederhana untuk tipe file
      if (file.type !== "text/csv") {
        setMessage("File tidak valid. Harap pilih file dengan format .csv");
        setIsError(true);
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
    }
  };

  /**
   * Menangani proses upload file ke server.
   */
  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) {
      setMessage("Tidak ada file yang dipilih. Silakan pilih file terlebih dahulu.");
      setIsError(true);
      return;
    }

    setUploading(true);
    setMessage("Mengunggah file...");
    setIsError(false);

    const formData = new FormData();
    formData.append("csvfile", selectedFile); // 'csvfile' adalah key yang akan diterima backend

    try {
      const response = await fetch(`${BASE_URL}/api/stok/opname/upload`, {
        method: 'POST',
        body: formData,
        // Headers 'Content-Type' tidak perlu di-set manual saat menggunakan FormData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengunggah file.");
      }
      
      setMessage(result.message || "File berhasil diunggah dan diproses!");
      setIsError(false);
      setSelectedFile(null); // Kosongkan pilihan file setelah berhasil

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
  }, [selectedFile]);

  // --- Render Logic ---
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
            {selectedFile ? `✔️ ${selectedFile.name}` : '📁 Pilih File CSV'}
          </label>
          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={uploading}
            style={{ display: 'none' }} // Input disembunyikan, di-trigger oleh label
          />
          
          <button 
            type="submit" 
            className="upload-button" 
            disabled={!selectedFile || uploading}
          >
            {uploading ? 'Memproses...' : 'Upload dan Proses'}
          </button>
        </form>

        {message && (
          <div className={`upload-status ${isError ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default StokOpname;