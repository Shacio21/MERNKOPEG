import React from "react";
import Polman from "../../assets/logopolman.svg"
import Kopeg from "../../assets/logokopeg.svg"
import "../../style/landingpage.css";

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={Polman} alt="Logo Polman" className="logo" />
        <img src={Kopeg} alt="Logo Kopeg" className="logo" />
        <span className="brand">Koperasi Pegawai.</span>
      </div>

      <ul className="navbar-menu">
        <li className="active">
          <a href="#">Home</a>
        </li>
        <li>
          <a href="#">ger</a>
        </li>
        <li>
          <a href="#">ger</a>
        </li>
        <li>
          <a href="#">gerr</a>
        </li>
        <li>
          <a href="#">gerr</a>
        </li>
        <li>
          <a href="#">gerrr</a>
        </li>
        <li>
          <a href="#">gersdsrs</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
