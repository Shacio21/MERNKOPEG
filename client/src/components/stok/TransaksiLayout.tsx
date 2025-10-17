import React from "react";
import { Outlet } from "react-router-dom";
import SidebarStok from "./SidebarStok";
import "../../style/stok/stok.css"

interface StokLayoutProps {
  children?: React.ReactNode;
}

const StokLayout: React.FC<StokLayoutProps> = ({ children }) => {
  return (
    <div >
      {/* Sidebar */}
      <SidebarStok />

      {/* Main Content */}
      <div >

        {/* Page Content */}
        {children ? children : <Outlet />}
      </div>
    </div>
  );
};

export default StokLayout;
