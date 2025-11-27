import React, { useEffect, useState, useCallback } from "react";
import { 
  BiLineChart, 
  BiTrendingUp, 
  BiArchive, 
  BiLoaderAlt, 
  BiErrorCircle, 
  BiUpArrowAlt, 
  BiDownArrowAlt,
  BiRefresh
} from "react-icons/bi";
import "../../style/prediksi.css";

// Interface (tidak berubah)
interface PrediksiData {
  prediksi: number;
  pertumbuhan: number;
}

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Prediksi: React.FC = () => {
  const [penjualan, setPenjualan] = useState<PrediksiData | null>(null);
  const [keuntungan, setKeuntungan] = useState<PrediksiData | null>(null);
  const [stok, setStok] = useState<PrediksiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. PERBAIKAN: Fungsi ini sekarang HANYA bertugas mengambil data, tanpa mengatur state loading.
  const fetchData = useCallback(async () => {
    setError(null);
    try {
      const [penjualanRes, keuntunganRes, stokRes] = await Promise.all([
        fetch(`${BASE_URL}/api/prediksi/penjualan`),
        fetch(`${BASE_URL}/api/prediksi/keuntungan`),
        fetch(`${BASE_URL}/api/prediksi/stok`),
      ]);

      if (!penjualanRes.ok || !keuntunganRes.ok || !stokRes.ok) {
        throw new Error("Gagal mengambil data prediksi dari server");
      }

      setPenjualan(await penjualanRes.json());
      setKeuntungan(await keuntunganRes.json());
      setStok(await stokRes.json());

    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Terjadi kesalahan yang tidak diketahui");
    }
  }, []); // Dependensi kosong, fungsi ini stabil.

  // 2. PERBAIKAN: useEffect ini KHUSUS untuk memuat data pertama kali.
  useEffect(() => {
    const initialLoad = async () => {
      setLoading(true);
      await fetchData();
      setLoading(false);
    };
    initialLoad();
  }, [fetchData]);

  // 3. PERBAIKAN: Fungsi baru yang terpisah, KHUSUS untuk tombol refresh.
  const handleRefreshClick = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  // Helper & Render function (tidak berubah)
  const formatNumber = (num: number, isCurrency = false) => {
    const options: Intl.NumberFormatOptions = isCurrency
      ? { style: "currency", currency: "IDR", minimumFractionDigits: 0 }
      : {};
    return new Intl.NumberFormat("id-ID", options).format(num);
  };

  const renderCard = (
    title: string, data: PrediksiData | null, unit: "currency" | "unit",
    IconComponent: React.ElementType, theme: "blue" | "green" | "orange"
  ) => {
    if (!data) return null;
    const isPositive = data.pertumbuhan >= 0;
    return (
      <div className={`prediksi-card theme-${theme}`}>
        <div className="prediksi-header">
          <div className="prediksi-icon-wrapper"><IconComponent /></div>
          <span className="prediksi-title">{title}</span>
        </div>
        <div className="prediksi-value">
          {formatNumber(data.prediksi, unit === "currency")}
        </div>
        <div className={`prediksi-growth ${isPositive ? "growth-up" : "growth-down"}`}>
          {isPositive ? <BiUpArrowAlt /> : <BiDownArrowAlt />}
          <span>{data.pertumbuhan.toFixed(2)}% Pertumbuhan Keseluruhan</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (<div className="status-container"><BiLoaderAlt className="spinner" /><span>Memuat Prediksi...</span></div>);
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Prediksi & Proyeksi Bisnis</h1>
          <p className="page-subtitle">Analisis tren berdasarkan data historis untuk bulan berikutnya.</p>
        </div>
        {/* 4. PERBAIKAN: onClick memanggil fungsi baru dan disabled dicek juga saat loading awal */}
        <button className="refresh-button" onClick={handleRefreshClick} disabled={refreshing || loading}>
          {refreshing ? <BiLoaderAlt className="spinner" /> : <BiRefresh />}
          <span>{refreshing ? "Memuat..." : "Refresh Prediksi"}</span>
        </button>
      </div>

      {error && (
        <div className="status-container error">
          <BiErrorCircle />
          <span>{error}</span>
        </div>
      )}

      {!error && (
        <div className="prediksi-grid">
          {renderCard("Prediksi Penjualan", penjualan, "currency", BiLineChart, "blue")}
          {renderCard("Prediksi Keuntungan", keuntungan, "currency", BiTrendingUp, "green")}
          {renderCard("Prediksi Sisa Stok", stok, "unit", BiArchive, "orange")}
        </div>
      )}
    </div>
  );
};

export default Prediksi;