import React, { useEffect, useState } from "react";
import "../../../style/Transaksi/pembelian.css";
import Pagination from "./Pagination";

const ITEMS_PER_PAGE = 10; // Sesuai limit API
const BASE_URL = "http://172.20.10.3:3001";

interface PembelianItem {
  _id: string;
  Kode_Item: number;
  Nama_Item: string;
  Jenis: string;
  Jumlah: number;
  Satuan: string;
  Total_Harga: number;
  Bulan: string;
  Tahun: number;
}

interface ApiResponse {
  success: boolean;
  currentPage: number;
  totalPages: number;
  totalData: number;
  data: PembelianItem[];
}

const PembelianTable: React.FC = () => {
  const [data, setData] = useState<PembelianItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Optional: search state (bisa dikembangkan jadi input)

  const fetchData = async (page: number) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${BASE_URL}/api/pembelian?page=${page}&limit=${ITEMS_PER_PAGE}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      const text = await res.text();
      console.log("📡 Raw API Response:", text);
      console.log("📡 Raw API Response:", res);

      const json: ApiResponse = JSON.parse(text);

      if (!json.success) {
        throw new Error("Gagal mengambil data dari server");
      }

      setData(json.data);
      setCurrentPage(json.currentPage);
      setTotalPages(json.totalPages);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat mengambil data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  return (
    <div className="pembelian-container">
      <h2 className="pembelian-title">Tabel Pembelian</h2>

      {loading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : data.length === 0 ? (
        <p>Tidak ada data.</p>
      ) : (
        <>
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
              {data.map((item) => (
                <tr key={item._id}>
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

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default PembelianTable;
