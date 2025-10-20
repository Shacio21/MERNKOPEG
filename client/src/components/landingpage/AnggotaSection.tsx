import React from "react";
import "../../style/landingpage.css";
// 1. Ganti/tambahkan impor ikon
import { BiWallet, BiInfoCircle, BiStore } from "react-icons/bi";
import { FaDollarSign } from "react-icons/fa";

const AnggotaSection: React.FC = () => {
  const fasilitas = [
    {
      id: 1,
      icon: <BiWallet />,
      title: "Simpanan",
      desc: "Simpanan pokok, wajib, dan sukarela dengan sistem yang aman dan transparan untuk masa depan yang lebih baik",
    },
    {
      id: 2,
      icon: <BiInfoCircle />,
      title: "Pinjaman",
      desc: "Pinjaman tunai dengan bunga rendah, proses cepat, dan tenor fleksibel sesuai kebutuhan anggota",
    },
    {
      id: 3,
      icon: <BiStore />,
      title: "Toko Koperasi",
      desc: "Menyediakan berbagai kebutuhan sehari-hari dengan sistem pembayaran yang mudah",
    },
    {
      id: 4,
      // 2. Ganti ikon di sini agar sesuai gambar
      icon: <FaDollarSign />,
      title: "SHU (Sisa Hasil Usaha)",
      desc: "Pembagian keuntungan koperasi setiap tahun kepada anggota berdasarkan partisipasi dan kontribusi",
    },
  ];

  return (
    <section className="fasilitas-section">
      <div className="fasilitas-title">
        <p className="subtitle">LAYANAN KAMI</p>
        <h2>Fasilitas Untuk Anggota</h2>
      </div>

      <div className="fasilitas-grid">
        {fasilitas.map((item) => (
          <div key={item.id} className="fasilitas-card">
            <div className="fasilitas-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AnggotaSection;
