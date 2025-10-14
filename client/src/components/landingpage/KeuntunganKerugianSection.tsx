import React from "react";
import "../../style/landingpage.css";
import keuntunganIcon from "../../assets/logokopeg.svg"; // ganti dengan path ikon keuntungan
import kerugianIcon from "../../assets/logokopeg.svg"; // ganti dengan path ikon kerugian
import bgImage from "../../assets/imagekeuntungankerugian.webp"; // ganti dengan path gambar latar

const KeuntunganKerugian: React.FC = () => {
  return (
    <section className="keuntungan-section">
      {/* Gambar Latar */}
      <img src={bgImage} alt="Keunggulan Koperasi" className="bg-image" />

      {/* Konten Utama */}
      <div className="keuntungan-content">
        {/* Judul Section */}
        <div className="section-title">
          <p className="subtitle">KOPEG POLMAN</p>
          <h1 className="title">KEUNTUNGAN DAN KERUGIAN</h1>
        </div>

        {/* Bagian Keuntungan & Kerugian */}
        <div className="info-group">
          {/* Keuntungan */}
          <div className="info-item">
            <div className="icon-circle">
              <img src={keuntunganIcon} alt="Keuntungan Icon" className="icon" />
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
              <img src={kerugianIcon} alt="Kerugian Icon" className="icon" />
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
