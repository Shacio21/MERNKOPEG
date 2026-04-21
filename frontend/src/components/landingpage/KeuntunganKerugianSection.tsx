import React from "react";
import "../../style/landingpage.css";
// 1. Impor ikon dari library
import { FaArrowUp, FaArrowDown } from "react-icons/fa"; 
import bgImage from "../../assets/imagekeuntungankerugian.webp";

const KeuntunganKerugian: React.FC = () => {
  return (
    <section className="keuntungan-section">
      <img src={bgImage} alt="Keunggulan Koperasi" className="bg-image" />

      <div className="keuntungan-content">
        <div className="section-title">
          <h1 className="title">KEUNTUNGAN DAN KERUGIAN</h1>
        </div>

        <div className="info-group">
          {/* Keuntungan */}
          <div className="info-item">
            <div className="icon-circle">
              {/* 2. Ganti <img> dengan komponen ikon */}
              <FaArrowUp className="icon" />
            </div>
            <div className="info-text">
              <h2>KEUNTUNGAN</h2>
              <p>
                Layanan simpanan dengan imbal hasil menarik dan pinjaman mudah
                dengan bunga ringan. Proses cepat, syarat sederhana, dan
                transparan.
              </p>
            </div>
          </div>

          <div className="divider"></div>

          {/* Kerugian */}
          <div className="info-item">
            <div className="icon-circle">
              {/* 3. Ganti <img> dengan komponen ikon */}
              <FaArrowDown className="icon" />
            </div>
            <div className="info-text">
              <h2>KERUGIAN</h2>
              <p>
                Kerugian terjadi jika biaya melebihi pendapatan. Dalam
                koperasi, kerugian biasanya dipikul bersama oleh seluruh
                anggota.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KeuntunganKerugian;
