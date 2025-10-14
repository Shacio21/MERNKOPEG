import React from "react";
import "../../style/landingpage.css";
import { BiRightArrowAlt } from "react-icons/bi";

import img1 from "../../assets/aice.webp";
import img2 from "../../assets/balsem.webp";
import img3 from "../../assets/chitato.webp";
import img4 from "../../assets/cimory.webp";
import img5 from "../../assets/miegoreng.webp";
import img6 from "../../assets/nabati.webp";
import img7 from "../../assets/nescafe.webp";
import img8 from "../../assets/oatside.webp";
import img9 from "../../assets/oreo.webp";
import img10 from "../../assets/sariroti.webp";

const ProductSection: React.FC = () => {
  const products = [
    {
      id: 1,
      image: img1,
      title: "Aice",
      desc: "Es krim lezat dengan berbagai varian rasa favorit semua kalangan.",
    },
    {
      id: 2,
      image: img2,
      title: "Balsem Cap Kaki Tiga",
      desc: "Balsem herbal tradisional untuk meredakan pegal, linu, dan nyeri otot.",
    },
    {
      id: 3,
      image: img3,
      title: "Chitato",
      desc: "Keripik kentang bergelombang dengan rasa gurih yang khas.",
    },
    {
      id: 4,
      image: img4,
      title: "Cimory",
      desc: "Susu segar dan yogurt berkualitas dari peternakan lokal.",
    },
    {
      id: 5,
      image: img5,
      title: "Indomie Goreng",
      desc: "Mi instan legendaris dengan cita rasa khas Indonesia.",
    },
    {
      id: 6,
      image: img6,
      title: "Nabati Wafer",
      desc: "Wafer renyah dengan krim lembut dan manis menggoda.",
    },
    {
      id: 7,
      image: img7,
      title: "Nescafe",
      desc: "Kopi instan berkualitas dengan aroma yang khas.",
    },
    {
      id: 8,
      image: img8,
      title: "Oatside",
      desc: "Susu oat creamy yang ramah lingkungan.",
    },
    {
      id: 9,
      image: img9,
      title: "Oreo",
      desc: "Biskuit cokelat dengan krim vanila klasik.",
    },
    {
      id: 10,
      image: img10,
      title: "Sari Roti",
      desc: "Roti lembut dan bergizi untuk sarapan maupun camilan.",
    },
  ];

  return (
    <section className="explore-section">
      <div className="explore-title">
        <p className="subtitle">POPULAR PRODUCTS</p>
        <h2>Explore Our Featured Brands</h2>
      </div>

      <div className="scroll-container">
        {products.map((p) => (
          <div key={p.id} className="product-card">
            <img src={p.image} alt={p.title} className="product-image" />
            <div className="overlay">
              <div className="text">
                <p className="category">{p.title}</p>
                <h3>{p.desc}</h3>
              </div>
              <BiRightArrowAlt className="arrow" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductSection;
