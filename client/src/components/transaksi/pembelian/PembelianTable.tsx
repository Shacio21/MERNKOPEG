import React from "react";
import CustomerRow from "./PembelianRow";
import "../../../style/Transaksi/pembelian.css"

interface Customer {
  phone: string;
  category: "Cold" | "Warm" | "Hot";
  lastActive: string;
}

const customers: Customer[] = [
  { phone: "+62 882 1739 2384", category: "Cold", lastActive: "20 minute ago" },
  { phone: "+62 857 5345 5213", category: "Cold", lastActive: "1 hour ago" },
  { phone: "+62 815 4536 2683", category: "Hot", lastActive: "Yesterday" },
  { phone: "+62 879 3813 3249", category: "Warm", lastActive: "07/09/2025" },
  { phone: "+62 879 3904 0284", category: "Warm", lastActive: "07/09/2025" },
  { phone: "+62 879 3904 0285", category: "Warm", lastActive: "07/09/2025" },
  { phone: "+62 879 3904 0286", category: "Hot", lastActive: "07/09/2025" },
  { phone: "+62 879 3904 0287", category: "Hot", lastActive: "07/09/2025" },
  { phone: "+62 879 3904 0288", category: "Warm", lastActive: "07/09/2025" },
  { phone: "+62 879 3904 0289", category: "Cold", lastActive: "07/09/2025" },
  { phone: "+62 879 3904 0210", category: "Warm", lastActive: "07/09/2025" },
  { phone: "+62 879 3904 0211", category: "Warm", lastActive: "07/09/2025" },
  { phone: "+62 879 3904 0212", category: "Hot", lastActive: "07/09/2025" },
  { phone: "+62 879 3904 0213", category: "Hot", lastActive: "07/09/2025" },
  { phone: "+62 879 3904 0214", category: "Warm", lastActive: "07/09/2025" },
];

const PembelianTable: React.FC = () => {
  return (
      <div className="customer-table-container">
        <table className="customer-table">
          <thead>
            <tr>
              <th>Phone Number</th>
              <th>Categories</th>
              <th>Last Active Chat Timestamp</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c, i) => (
              <CustomerRow
                key={i}
                phone={c.phone}
                category={c.category}
                lastActive={c.lastActive}
              />
            ))}
          </tbody>
        </table>
      </div>
  );
};

export default PembelianTable;