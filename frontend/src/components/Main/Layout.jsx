import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import "./layout.css";
import { useState } from "react";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="layout-container">
      <Sidebar onToggle={setCollapsed} />
      <div className={`main-content ${collapsed ? "collapsed" : ""}`}>
        <Header />
        <div className="content-area">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
  
}
