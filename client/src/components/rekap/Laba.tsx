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

/**
 * Interface defining the structure for profit data points.
 */
interface LabaData {
  Bulan: string;
  Tahun: number;
  totalPembelian: number;
  totalPenjualan: number;
  totalPengembalian: number;
  keuntungan: number;
}

const BASE_URL = import.meta.env.VITE_BASE_URL;

/**
 * A React functional component that displays a line chart of monthly profits.
 */
const Laba: React.FC = () => {
  // State for storing the chart data
  const [data, setData] = useState<LabaData[]>([]);
  // State for managing loading status
  const [loading, setLoading] = useState<boolean>(true);
  // State for capturing potential fetch errors
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/keuntungan`);
        if (!response.ok) {
          throw new Error("Gagal mengambil data dari server.");
        }
        const json = await response.json();

        // Define the correct chronological order of months for sorting
        const monthOrder = [
          "JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI",
          "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER",
        ];

        // Sort the data from the API to ensure it's in chronological order
        const sortedData = json.sort(
          (a: LabaData, b: LabaData) =>
            monthOrder.indexOf(a.Bulan.toUpperCase()) - monthOrder.indexOf(b.Bulan.toUpperCase())
        );

        setData(sortedData);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
        setError("Tidak dapat memuat data keuntungan. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this effect runs only once on mount

  /**
   * Formats a number into Indonesian Rupiah currency string.
   * @param value - The number to format.
   * @returns A formatted currency string (e.g., "Rp 1.000.000").
   */
  const formatRupiah = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

  // Conditional rendering based on loading and error states
  if (loading) return <div className="laba-status">Memuat data...</div>;
  if (error) return <div className="laba-status error">{error}</div>;

  return (
    <div className="laba-container">
      <h2 className="laba-title">Grafik Keuntungan per Bulan (2025)</h2>
      <div className="laba-chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="Bulan" tick={{ fill: "#555" }} />
            <YAxis tickFormatter={formatRupiah} tick={{ fill: "#555" }} width={80} />
            <Tooltip
              formatter={(value: number) => formatRupiah(value)}
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #cccccc",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="keuntungan"
              name="Keuntungan (Rp)"
              stroke="#4caf50"
              strokeWidth={3}
              dot={{ r: 5, fill: "#4caf50" }}
              activeDot={{ r: 8, stroke: "#ffffff", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Laba;