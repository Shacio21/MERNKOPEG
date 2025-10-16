import React, { useEffect, useState } from "react";
import "../../style/prediksi.css";

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrediksi = async () => {
      try {
        const [penjualanRes, keuntunganRes, stokRes] = await Promise.all([
          fetch(`${BASE_URL}/api/prediksi/penjualan`),
          fetch(`${BASE_URL}/api/prediksi/keuntungan`),
          fetch(`${BASE_URL}/api/prediksi/stok`),
        ]);

        if (!penjualanRes.ok || !keuntunganRes.ok || !stokRes.ok) {
          throw new Error("Gagal mengambil data prediksi");
        }

        const penjualanData = await penjualanRes.json();
        const keuntunganData = await keuntunganRes.json();
        const stokData = await stokRes.json();

        setPenjualan(penjualanData);
        setKeuntungan(keuntunganData);
        setStok(stokData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrediksi();
  }, []);

  const formatNumber = (num: number) => {
    return num.toLocaleString("id-ID");
  };

  const renderCard = (
    title: string,
    data: PrediksiData | null,
    unit: string,
    icon: string
  ) => {
    if (!data) return null;
    const isPositive = data.pertumbuhan >= 0;

    return (
      <div className="prediksi-card">
        <div className="prediksi-header">
          <span className="prediksi-icon">{icon}</span>
          <span className="prediksi-title">{title}</span>
        </div>
        <div className="prediksi-value">
          {unit} {formatNumber(data.prediksi)}
        </div>
        <div
          className={`prediksi-growth ${
            isPositive ? "growth-up" : "growth-down"
          }`}
        >
          {isPositive ? "▲" : "▼"} {data.pertumbuhan.toFixed(2)}%
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="prediksi-loading">Memuat prediksi...</div>;
  }

  if (error) {
    return <div className="prediksi-error">{error}</div>;
  }

  return (
    <div className="prediksi-container">
      {renderCard("Penjualan", penjualan, "Rp", "📈")}
      {renderCard("Keuntungan", keuntungan, "Rp", "💰")}
      {renderCard("Stok", stok, "", "📦")}
    </div>
  );
};

export default Prediksi;
