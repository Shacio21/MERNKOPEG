import React from "react";
import CategoryBadge from "./PembelianBadge";
import "../../../style/Transaksi/pembelian.css"

interface PembelianRowProps {
  phone: string;
  category: "Cold" | "Warm" | "Hot";
  lastActive: string;
}

const PembelianRow: React.FC<PembelianRowProps> = ({ phone, category, lastActive }) => {
  return (
    <tr>
      <td>{phone}</td>
      <td>
        <CategoryBadge category={category} />
      </td>
      <td>{lastActive}</td>
      <td className="dots">...</td>
    </tr>
  );
};

export default PembelianRow;