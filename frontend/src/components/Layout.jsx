import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import "../styles/layout.css";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="layout-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="content-area">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
  
}
