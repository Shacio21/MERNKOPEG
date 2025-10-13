import React from "react";
import "../../style/landingpage.css";
import backgroundhero from "../../assets/backgroundhero.webp";

const HeroSection: React.FC = () => {
  return (
    <section
      className="hero-section"
    >
      <div className="hero-content">
        <div className="hero-label">
          <span className="hero-underline"></span>
          <span className="hero-original">WEBSITE</span>
        </div>

        <div className="hero-text">
          <div className="hero-title">
            <h1 className="title-yellow">KOPERASI PEGAWAI</h1>
            <div className="title-icon"></div>
            <h1 className="title-white">POLMAN</h1>
          </div>

          <p className="hero-description">
            Website Rekap Data Penjualan dari mini market Koperasi Pegawai Polman Manufaktur Bandung
          </p>

          <button className="hero-button">Discover More</button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
