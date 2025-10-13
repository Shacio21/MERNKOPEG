import React from "react";
import "../../style/landingpage.css";
import backgroundhero from "../../assets/backgroundhero.webp";

const HeroSection: React.FC = () => {
  return (
    <section
    className="hero-section"
    style={{ backgroundImage: `url(${backgroundhero})` }}
    >
      <div className="hero-content">
        <div className="hero-label">
          <span className="hero-underline"></span>
          <span className="hero-original">WEBSITE</span>
        </div>

        <div className="hero-text">
          <div className="hero-title">
            <h1 className="title-yellow">Koperasi Pegawai</h1>
            <div className="title-icon"></div>
            <h1 className="title-white">Polman</h1>
          </div>

          <p className="hero-description">
            Dissuade ecstatic and properly saw entirely sir why laughter
            endeavor. In on my jointure horrible margaret suitable he speedily.
          </p>

          <button className="hero-button">Discover More</button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
