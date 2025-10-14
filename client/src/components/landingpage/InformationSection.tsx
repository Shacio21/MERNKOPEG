import React from "react";
import "../../style/landingpage.css";
import image6 from "../../assets/backgroundhero.webp"; // ganti dengan path gambar yang sesuai

const InformationSection: React.FC = () => {
  return (
    <section className="intro-section">
      <div className="intro-left-bg"></div>
      <div className="intro-yellow-bar"></div>

      <div className="intro-image-container">
        <img src={image6} alt="Organic Farming" className="intro-image" />

        <div className="project-card">
          <div className="project-icon"></div>
          <div className="project-line"></div>
          <div className="project-text">
            <h2>86,700</h2>
            <p>Successfully Project Completed</p>
          </div>
        </div>
      </div>

      <div className="intro-text">
        <div className="intro-title">
          <p className="intro-sub">OUR INTRODUCTION</p>
          <h1>Pure Agriculture and Organic Form</h1>
        </div>

        <div className="intro-desc">
          <h3>Were Leader in Agriculture Market</h3>
          <p>
            There are many variations of passages of available but the majority
            have suffered alteration in some form, by injected humour, or
            randomized words even slightly believable.
          </p>
        </div>

        <ul className="intro-list">
          <li>Organic food contains more vitamins</li>
          <li>Eat organic because supply meets demand</li>
          <li>Organic food is never irradiated</li>
        </ul>
      </div>
    </section>
  );
};

export default InformationSection;
