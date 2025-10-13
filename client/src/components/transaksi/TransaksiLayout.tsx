import React from "react";
import { Outlet } from "react-router-dom";
import SidebarTransaksi from "./SidebarTransaksi";

interface TransaksiLayoutProps {
  children?: React.ReactNode;
}

const TransaksiLayout: React.FC<TransaksiLayoutProps> = ({ children }) => {
  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <SidebarTransaksi />

      {/* Main Content */}
      <div className="admin-content">
        {/* Header */}
        <div className="admin-header">
          <h2>
            Welcome, <span className="admin-username">admin</span>
          </h2>
          <div className="admin-avatar"></div>
        </div>

        {/* Page Content */}
        {children ? children : <Outlet />}
      </div>
    </div>
  );
};

export default TransaksiLayout;