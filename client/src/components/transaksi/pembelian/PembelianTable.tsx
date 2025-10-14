import React, { useEffect, useState } from "react";
import "../../../style/Transaksi/pembelian.css";
import Pagination from "./Pagination";

const ITEMS_PER_PAGE = 10;
const BASE_URL = "http://172.20.10.3:3001";

interface PembelianItem {
  Kode_Item: number;
  Nama_Item: string;
  Jenis: string;
  Jumlah: number;
  Satuan: string;
  Total_Harga: number;
  Bulan: string;
  Tahun: number;
}

const PembelianTable: React.FC = () => {
  const [data, setData] = useState<PembelianItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/pembelian`, {
          headers: {
            Accept: "application/json",
          },
        });

        const text = await res.text();
        console.log("📡 Raw API Response:", text); // <— cek isi respons mentahnya di browser console

        try {
          const json = JSON.parse(text);
          setData(json);
        } catch {
          throw new Error(
            "Respons dari server bukan JSON. Cek console.log untuk melihat isi respons."
          );
        }
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan saat mengambil data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
              {currentData.map((item, idx) => (
                <tr key={idx}>
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

          {data.length > ITEMS_PER_PAGE && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default PembelianTable;
