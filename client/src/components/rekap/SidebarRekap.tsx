import React, { useState } from "react";
import {
  BiDisc,
  BiLogOut,
  BiCartAdd,
  BiReceipt,
} from "react-icons/bi";
import "../../style/rekap/rekap.css";

const SidebarRekap: React.FC = () => {
  const [activeLink, setActiveLink] = useState<string>("Home");

  const handleLinkClick = (name: string) => setActiveLink(name);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header__container">
          <a href="#" className="header__logo">
            Koperasi Pegawai
          </a>
        </div>
      </header>

      {/* Sidebar */}
      <div className="nav" id="navbar">
        <nav className="nav__container">
          <div>
            <a href="/" className="nav__link nav__logo">
              <BiDisc className="nav__icon" />
              <span className="nav__logo-name">KOPEG</span>
            </a>

            <div className="nav__list">
              <div className="nav__items">
                <h3 className="nav__subtitle">REKAP</h3>

                <a
                  href="/rekap"
                  className={`nav__link ${
                    activeLink === "Pembelian" ? "active" : ""
                  }`}
                  onClick={() => handleLinkClick("Pembelian")}
                >
                  <BiCartAdd className="nav__icon" />
                  <span className="nav__name">Keuntungan</span>
                </a>

                <a
                  href="/transaksi/penjualan"
                  className={`nav__link ${
                    activeLink === "Penjualan" ? "active" : ""
                  }`}
                  onClick={() => handleLinkClick("Penjualan")}
                >
                  <BiReceipt className="nav__icon" />
                  <span className="nav__name">Kerugian</span>
                </a>
              </div>
            </div>
          </div>

          <a href="/" className="nav__link nav__logout">
            <BiLogOut className="nav__icon" />
            <span className="nav__name">Back</span>
          </a>
        </nav>
      </div>
    </div>
  );
};

export default SidebarRekap;
