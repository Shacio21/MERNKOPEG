import React, { useEffect, useState, useCallback } from "react";
import {
  BiLoaderAlt,
  BiErrorCircle,
  BiTrophy,
  BiPoll,
} from "react-icons/bi";
import "../../style/rekap/produklaris.css"; // Kita akan buat file CSS ini

// Tentukan interface untuk struktur data produk
interface Produk {
  _id: string | number;
  Nama_Item: string;
  Jumlah: number;
}

// Tentukan interface untuk respons API (jika data dibungkus)
interface ApiResponse {
  data: Produk[];
  // Tambahkan properti lain dari API Anda jika ada, misal: total, page, etc.
}

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Daftar bulan untuk filter dropdown
const daftarBulan = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const ProdukLaris: React.FC = () => {
  // State untuk menyimpan data produk
  const [produkLaris, setProdukLaris] = useState<Produk[]>([]);
  const [produkTidakLaris, setProdukTidakLaris] = useState<Produk[]>([]);

  // State untuk filter
  const [bulan, setBulan] = useState<string>(daftarBulan[new Date().getMonth()]);
  const [tahun, setTahun] = useState<number>(new Date().getFullYear());
  
  // State untuk loading dan error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fungsi untuk mengambil data, dibungkus dengan useCallback
  const fetchData = useCallback(async (selectedBulan: string, selectedTahun: number) => {
    setLoading(true);
    setError(null);

    const limit = 5; // Tampilkan 5 produk teratas/terbawah
    const sortBy = "Jumlah";

    // Endpoint untuk produk laris (order=desc)
    const urlLaris = `${BASE_URL}/api/penjualan?bulan=${selectedBulan}&tahun=${selectedTahun}&sortBy=${sortBy}&order=desc&limit=${limit}`;
    
    // Endpoint untuk produk tidak laris (order=asc)
    const urlTidakLaris = `${BASE_URL}/api/penjualan?bulan=${selectedBulan}&tahun=${selectedTahun}&sortBy=${sortBy}&order=asc&limit=${limit}`;

    try {
      const [larisRes, tidakLarisRes] = await Promise.all([
        fetch(urlLaris),
        fetch(urlTidakLaris),
      ]);

      if (!larisRes.ok || !tidakLarisRes.ok) {
        throw new Error("Gagal mengambil data produk dari server");
      }

      const larisData: ApiResponse = await larisRes.json();
      const tidakLarisData: ApiResponse = await tidakLarisRes.json();
      
      // Pastikan API mengembalikan object dengan key 'data'
      setProdukLaris(larisData.data || []);
      setProdukTidakLaris(tidakLarisData.data || []);

    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Terjadi kesalahan yang tidak diketahui");
    } finally {
      setLoading(false);
    }
  }, []);

  // useEffect untuk memuat data saat filter berubah
  useEffect(() => {
    fetchData(bulan, tahun);
  }, [bulan, tahun, fetchData]);

  // Helper function untuk render list produk
  const renderProdukList = (
    title: string,
    data: Produk[],
    IconComponent: React.ElementType,
    theme: "laris" | "tidak-laris"
  ) => (
    <div className={`produk-list-card theme-${theme}`}>
      <div className="list-header">
        <IconComponent className="header-icon" />
        <h3 className="header-title">{title}</h3>
      </div>
      {data.length > 0 ? (
        <ol className="produk-list">
          {data.map((produk) => (
            <li key={produk._id} className="produk-item">
              <span className="produk-name">{produk.Nama_Item}</span>
              <span className="produk-jumlah">{(produk.Jumlah || 0).toLocaleString('id-ID')} terjual</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="produk-empty">Tidak ada data untuk ditampilkan.</p>
      )}
    </div>
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Laporan Produk</h1>
          <p className="page-subtitle">Analisis produk paling laris dan kurang laris berdasarkan penjualan.</p>
        </div>
      </div>

      <div className="filter-container">
        <div className="filter-group">
          <label htmlFor="bulan-select">Bulan:</label>
          <select id="bulan-select" value={bulan} onChange={(e) => setBulan(e.target.value)} disabled={loading}>
            {daftarBulan.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="tahun-select">Tahun:</label>
          <select id="tahun-select" value={tahun} onChange={(e) => setTahun(Number(e.target.value))} disabled={loading}>
            {/* Buat daftar 5 tahun terakhir */}
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="status-container"><BiLoaderAlt className="spinner" /><span>Memuat Laporan Produk...</span></div>
      ) : error ? (
        <div className="status-container error"><BiErrorCircle /><span>{error}</span></div>
      ) : (
        <div className="produk-grid">
          {renderProdukList("Produk Paling Laris", produkLaris, BiTrophy, "laris")}
          {renderProdukList("Produk Kurang Laris", produkTidakLaris, BiPoll, "tidak-laris")}
        </div>
      )}
    </div>
  );
};

export default ProdukLaris;