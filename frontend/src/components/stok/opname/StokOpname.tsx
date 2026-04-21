import React, { useState, useCallback } from "react";
import Swal from "sweetalert2";
import "../../../style/stok/stok.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface PerbedaanItem {
  Kode_Item: string;
  Nama_Item: string;
  Bulan: string;
  Tahun: string;
  CSV?: {
    Jumlah_Beli: string;
    Jumlah_Jual: string;
    Jumlah_Retur: string;
    Stok_Akhir: string;
  };
  DB?: {
    Jumlah_Beli: number;
    Jumlah_Jual: number;
    Jumlah_Retur: number;
    Stok_Akhir: number;
  };
  Keterangan?: string;
}

const StokOpname: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [perbedaan, setPerbedaan] = useState<PerbedaanItem[] | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPerbedaan(null);

    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/csv") {
      Swal.fire({
        title: "Format Tidak Didukung!",
        text: "Harap pilih file dengan format .csv",
        icon: "error",
        confirmButtonColor: "#d33",
      });
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);

    Swal.fire({
      title: "File Dipilih",
      text: `✔️ ${file.name}`,
      icon: "success",
      timer: 1200,
      showConfirmButton: false,
    });
  };

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      if (!selectedFile) {
        Swal.fire({
          title: "Tidak Ada File",
          text: "Silakan pilih file CSV terlebih dahulu",
          icon: "warning",
        });
        return;
      }

      setUploading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const response = await fetch(`${BASE_URL}/api/stok/stok-opname`, {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Gagal memproses file.");
        }

        if (result.perbedaan && Array.isArray(result.perbedaan)) {
          Swal.fire({
            title: "Perbedaan ditemukan!",
            text: "Ada data stok yang berbeda. Silakan cek tabel di bawah.",
            icon: "warning",
            confirmButtonColor: "#f39c12",
          });
          setPerbedaan(result.perbedaan);
        } else {
          Swal.fire({
            title: "Berhasil!",
            text: result.message || "File berhasil diproses.",
            icon: "success",
          });
          setPerbedaan(null);
        }

        setSelectedFile(null);
      } catch (err: any) {
        Swal.fire({
          title: "Terjadi Kesalahan",
          text: err.message,
          icon: "error",
        });
      } finally {
        setUploading(false);
      }
    },
    [selectedFile]
  );

  return (
    <div className="stock-container">
      <h2 className="stock-title">📦 Import Stok Opname (CSV)</h2>

      <form onSubmit={handleSubmit} className="upload-form">
        <label className="upload-drop-area">
          <span className="upload-text">
            {selectedFile ? selectedFile.name : "Klik untuk memilih file atau drag ke sini"}
          </span>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>

        <button
          type="submit"
          className="upload-button"
          disabled={!selectedFile || uploading}
        >
          {uploading ? "Memproses..." : "Upload & Proses"}
        </button>
      </form>

      {/* ✅ Tabel hasil perbedaan */}
      {perbedaan && perbedaan.length > 0 && (
        <div className="perbedaan-wrapper">
          <h3>🔍 Detail Perbedaan Stok</h3>
          <table className="perbedaan-table">
            <thead>
              <tr>
                <th>Kode</th>
                <th>Nama</th>
                <th>Bulan</th>
                <th>Tahun</th>
                <th>CSV Beli</th>
                <th>DB Beli</th>
                <th>CSV Jual</th>
                <th>DB Jual</th>
                <th>CSV Retur</th>
                <th>DB Retur</th>
                <th>CSV Akhir</th>
                <th>DB Akhir</th>
                <th>Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {perbedaan.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.Kode_Item}</td>
                  <td>{item.Nama_Item}</td>
                  <td>{item.Bulan}</td>
                  <td>{item.Tahun}</td>
                  <td>{item.CSV?.Jumlah_Beli ?? "-"}</td>
                  <td>{item.DB?.Jumlah_Beli ?? "-"}</td>
                  <td>{item.CSV?.Jumlah_Jual ?? "-"}</td>
                  <td>{item.DB?.Jumlah_Jual ?? "-"}</td>
                  <td>{item.CSV?.Jumlah_Retur ?? "-"}</td>
                  <td>{item.DB?.Jumlah_Retur ?? "-"}</td>
                  <td>{item.CSV?.Stok_Akhir ?? "-"}</td>
                  <td>{item.DB?.Stok_Akhir ?? "-"}</td>
                  <td>{item.Keterangan ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StokOpname;
