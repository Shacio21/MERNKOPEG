import React, { useState } from "react";
import {
  BiDisc,
  BiLogOut,
  BiRefresh,
  BiCartAdd,
  BiReceipt,
  BiTrendingUp,
  BiArchive,
  BiClipboard,
  BiLineChart,
  BiTrophy,
} from "react-icons/bi";
import "../../style/Transaksi/transaksi.css";
import Kopeg from "../../assets/logokopeg.svg"
import "../../style/landingpage.css";

const SidebarPrediksi: React.FC = () => {
  const [activeLink, setActiveLink] = useState<string>("Home");

  const handleLinkClick = (name: string) => setActiveLink(name);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header__container">
          <div className="navbar-left">
          <a href="/" className="header__logo">
            Koperasi Pegawai
          </a>
          <img src={Kopeg} alt="Logo Kopeg" className="logo" />
          </div>
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
                <h3 className="nav__subtitle">TRANSAKSI</h3>

                <a
                  href="/transaksi/pembelian"
                  className={`nav__link ${
                    activeLink === "Pembelian" ? "active" : ""
                  }`}
                  onClick={() => handleLinkClick("Pembelian")}
                >
                  <BiCartAdd className="nav__icon" />
                  <span className="nav__name">Pembelian</span>
                </a>

                <a
                  href="/transaksi/penjualan"
                  className={`nav__link ${
                    activeLink === "Penjualan" ? "active" : ""
                  }`}
                  onClick={() => handleLinkClick("Penjualan")}
                >
                  <BiReceipt className="nav__icon" />
                  <span className="nav__name">Penjualan</span>
                </a>

                <a
                  href="/transaksi/pengembalian"
                  className={`nav__link ${
                    activeLink === "Pengembalian" ? "active" : ""
                  }`}
                  onClick={() => handleLinkClick("Pengembalian")}
                >
                  <BiRefresh className="nav__icon" />
                  <span className="nav__name">Pengembalian</span>
                </a>
              </div>
            </div>

            <div className="nav__list">
              <div className="nav__items">
                <h3 className="nav__subtitle">Rekap</h3>

                <a
                  href="/rekap/laba"
                  className={`nav__link ${
                    activeLink === "Laba" ? "active" : ""
                  }`}
                  onClick={() => handleLinkClick("Laba")}
                >
                  <BiTrendingUp className="nav__icon" />
                  <span className="nav__name">Laba</span>
                </a>

                <a
                  href="/rekap/produklaris"
                  className={`nav__link ${
                    activeLink === "Produk" ? "active" : ""
                  }`}
                  onClick={() => handleLinkClick("Produk")}
                >
                  <BiTrophy className="nav__icon" />
                  <span className="nav__name">Produk</span>
                </a>
              </div>
            </div>

            <div className="nav__list">
              <div className="nav__items">
                <h3 className="nav__subtitle">STOCK</h3>

                <a
                  href="/stok/total"
                  className={`nav__link ${
                    activeLink === "Total" ? "active" : ""
                  }`}
                  onClick={() => handleLinkClick("Total")}
                >
                  <BiArchive className="nav__icon" />
                  <span className="nav__name">Stock Total</span>
                </a>

                <a
                  href="/stok/bulanan"
                  className={`nav__link ${
                    activeLink === "Opname" ? "active" : ""
                  }`}
                  onClick={() => handleLinkClick("Opname")}
                >
                  <BiClipboard className="nav__icon" />
                  <span className="nav__name">Stock Opname</span>
                </a>
              </div>
            </div>

            <div className="nav__list">
              <div className="nav__items">
                <h3 className="nav__subtitle">PREDIKSI</h3>

                <a
                  href="/prediksi"
                  className={`nav__link ${
                    activeLink === "Prediksi" ? "active" : ""
                  }`}
                  onClick={() => handleLinkClick("Prediksi")}
                >
                  <BiLineChart className="nav__icon" />
                  <span className="nav__name">Prediksi</span>
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

export default SidebarPrediksi;
