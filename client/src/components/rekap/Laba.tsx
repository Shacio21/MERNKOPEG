import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "../../style/rekap/laba.css";

interface LabaData {
  Bulan: string;
  Tahun: number;
  totalPembelian: number;
  totalPenjualan: number;
  totalPengembalian: number;
  keuntungan: number;
}

const BASE_URL = "http://172.16.21.128:3001/api/keuntungan";

const Laba: React.FC = () => {
  const [data, setData] = useState<LabaData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(BASE_URL);
        const json = await res.json();
        // Sort urut dari Januari sampai Desember
        const urutanBulan = [
          "JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI",
          "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER",
        ];
        const sorted = json.sort(
          (a: LabaData, b: LabaData) =>
            urutanBulan.indexOf(a.Bulan) - urutanBulan.indexOf(b.Bulan)
        );
        setData(sorted);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatRupiah = (value: number) =>
    `Rp ${value.toLocaleString("id-ID")}`;

  if (loading) return <div className="laba-loading">Memuat data...</div>;

  return (
    <div className="laba-container">
      <h2 className="laba-title">Grafik Keuntungan per Bulan (2025)</h2>
      <div className="laba-chart-wrapper">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Bulan" tick={{ fill: "#555" }} />
            <YAxis tickFormatter={formatRupiah} tick={{ fill: "#555" }} />
            <Tooltip
              formatter={(value: number) => formatRupiah(value)}
              contentStyle={{ backgroundColor: "#fff", borderRadius: "8px" }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="keuntungan"
              stroke="#4caf50"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 8 }}
              name="Keuntungan (Rp)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Laba;
