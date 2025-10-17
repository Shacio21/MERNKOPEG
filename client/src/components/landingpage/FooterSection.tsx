import React, { useState } from "react";
import "../../style/landingpage.css";
import {
  BiLogoFacebook,
  BiLogoTwitter,
  BiLogoYoutube,
  BiLogoInstagram,
} from "react-icons/bi";

const FooterSection: React.FC = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !message.trim()) {
      alert("Harap isi nama dan pesan terlebih dahulu!");
      return;
    }

    alert("Terima kasih atas masukan Anda!");

    // reset input setelah submit
    setName("");
    setMessage("");
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* LEFT - Logo & Description */}
        <div className="footer-left">
          <h2>KOPEG POLMAN</h2>
          <p>
            Koperasi Pegawai Politeknik Manufaktur Bandung mendukung
            kesejahteraan anggota melalui pelayanan simpan pinjam, toko, dan
            usaha produktif lainnya.
          </p>
          <div className="divider"></div>
          <div className="social-icons">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <BiLogoFacebook />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <BiLogoTwitter />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <BiLogoYoutube />
            </a>
            <a
              href="https://instagram.com/kkp.kopegpolman"
              target="_blank"
              rel="noopener noreferrer"
            >
              <BiLogoInstagram />
            </a>
          </div>
        </div>

        {/* MIDDLE - Group Members */}
        <div className="footer-middle">
          <h3>Anggota Kelompok 1</h3>
          <ul>
            <li>
              <a
                href="https://instagram.com/mahnndraa_"
                target="_blank"
                rel="noopener noreferrer"
              >
                223443083 - Mahendra Nur Pramudiansyah
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/m.dirgam21s"
                target="_blank"
                rel="noopener noreferrer"
              >
                223443086 - Muhammad Dirgam Shacio
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/naghifaa_"
                target="_blank"
                rel="noopener noreferrer"
              >
                223443088 - Najla Ghina Nazhifa
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/reytaufik"
                target="_blank"
                rel="noopener noreferrer"
              >
                223443090 - Raihan Taufik Suryana
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/roppp.ahmd"
                target="_blank"
                rel="noopener noreferrer"
              >
                223443093 - Roofi Ahmad
              </a>
            </li>
          </ul>
        </div>

        {/* RIGHT - Kritik & Saran */}
        <div className="footer-right">
          <h3>Kritik & Saran</h3>
          <p>
            Kami sangat menghargai setiap masukan yang membantu kami menjadi
            lebih baik.
          </p>
          <form className="feedback-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nama Anda"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <textarea
              placeholder="Tulis pesan Anda..."
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
            <button type="submit">Kirim</button>
          </form>
        </div>
      </div>

      <div className="footer-divider"></div>

      <div className="footer-bottom">
        <p>© Kelompok 1 Big Data 2025</p>
        <div className="footer-links">
          <a href="#">Kebijakan Privasi</a>
          <a href="#">Syarat & Ketentuan</a>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
