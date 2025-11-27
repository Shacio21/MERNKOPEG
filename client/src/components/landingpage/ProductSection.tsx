import React from "react";
import "../../style/landingpage.css";

import img1 from "../../assets/aice.webp";
import img2 from "../../assets/aqua.webp";
import img3 from "../../assets/chitato.webp";
import img4 from "../../assets/cimory.webp";
import img5 from "../../assets/miegoreng.webp";
import img6 from "../../assets/nabati.webp";
import img7 from "../../assets/nescafe.webp";
import img8 from "../../assets/oatside.webp";
import img9 from "../../assets/oreo.webp";
import img10 from "../../assets/sariroti.webp";

// Dihapus: useRef, useEffect, dan useState untuk rotasi 3D

const ProductSection: React.FC = () => {
  const products = [
    // Data produk Anda tetap sama
    { id: 1, image: img1, title: "Aice", desc: "Es krim lezat dengan berbagai varian rasa." },
    { id: 2, image: img2, title: "Aqua 600ml", desc: "Air mineral murni menyegarkan." },
    { id: 3, image: img3, title: "Chitato", desc: "Keripik kentang bergelombang yang gurih." },
    { id: 4, image: img4, title: "Cimory", desc: "Susu segar dan yogurt berkualitas." },
    { id: 5, image: img5, title: "Indomie Goreng", desc: "Mi instan legendaris cita rasa Indonesia." },
    { id: 6, image: img6, title: "Nabati Wafer", desc: "Wafer renyah dengan krim lembut." },
    { id: 7, image: img7, title: "Nescafe", desc: "Kopi instan dengan aroma khas." },
    { id: 8, image: img8, title: "Oatside", desc: "Susu oat creamy ramah lingkungan." },
    { id: 9, image: img9, title: "Oreo", desc: "Biskuit cokelat dengan krim vanila klasik." },
    { id: 10, image: img10, title: "Sari Roti", desc: "Roti lembut bergizi untuk sarapan." },
  ];

  return (
    <section className="explore-section">
      <div className="explore-title">
        <p className="subtitle">PRODUK POPULER</p>
        <h2>Jelajahi Merek Unggulan Kami</h2>
      </div>

      {/* Container diubah untuk slider horizontal */}
      <div className="scroll-container">
        <div className="scroll-content">
          {/* Diubah: Duplikasi array products untuk efek loop tak terbatas */}
          {[...products, ...products].map((p, i) => (
            <div key={`${p.id}-${i}`} className="product-card">
              <img src={p.image} alt={p.title} />
              <div className="card-text">
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;