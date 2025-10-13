import React from "react";
import "../../../style/Transaksi/pembelian.css"

interface PembelianBadgeProps {
  category: "Cold" | "Warm" | "Hot";
}

const PembelianBadge: React.FC<PembelianBadgeProps> = ({ category }) => {
  return (
    <span className={`badge badge-${category.toLowerCase()}`}>
      {category}
    </span>
  );
};

export default PembelianBadge;