import React from "react";
import { Outlet } from "react-router-dom";
import SidebarTransaksi from "./SidebarTransaksi";
import "../../style/Transaksi/transaksi.css"

interface TransaksiLayoutProps {
  children?: React.ReactNode;
}

const TransaksiLayout: React.FC<TransaksiLayoutProps> = ({ children }) => {
  return (
    <div className="transaksi-layout">
      {/* Sidebar */}
      <SidebarTransaksi />

      {/* Main Content */}
      <div className="transaksi-layout-content">

        {/* Page Content */}
        {children ? children : <Outlet />}
      </div>
    </div>
  );
};

export default TransaksiLayout;
