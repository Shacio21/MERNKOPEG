import React from "react";
import "../../style/landingpage.css";
import image6 from "../../assets/backgroundhero.webp"; // ganti dengan path gambar yang sesuai

const InformationSection: React.FC = () => {
  return (
    <section className="intro-section">

      <div className="intro-image-container">
        <img src={image6} alt="Organic Farming" className="intro-image" />

        <div className="project-card">
          <div className="project-icon"></div>
          <div className="project-line"></div>
          <div className="project-text">
            <p>Sejak</p>
            <h2>1985</h2>
            <p>Melayani Anggota</p>
          </div>
        </div>
      </div>

      <div className="intro-text">
        <div className="intro-title">
          <p className="intro-sub">TENTANG KAMI</p>
          <h1>Koperasi Pegawai Politeknik Manufaktur</h1>
        </div>

        <div className="intro-desc">
          <h3>Kami Pemimpin dalam Layanan Koperasi Kampus</h3>
          <p>
            Koperasi Pegawai POLMAN telah melayani civitas akademika POLMAN Bandung sejak berdiri dengan beragam program unggulan yang memudahkan anggota untuk:
          </p>
        </div>

        <ul className="intro-list">
          <li>Menabung dan memperoleh bagi hasil yang adil</li>
          <li>Mengakses pinjaman dengan proses cepat dan bunga bersahabat</li>
          <li>Berbelanja kebutuhan di KOPEG Mart dengan sistem “Belanja Sekarang, Bayar Nanti”</li>
          <li>Menikmati program kesejahteraan anggota secara berkelanjutan</li>
        </ul>
      </div>
    </section>
  );
};

export default InformationSection;
