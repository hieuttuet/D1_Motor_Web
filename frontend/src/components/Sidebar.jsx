import { Link, useLocation } from "react-router-dom";
import "../styles/sidebar.css";
import { useState } from "react";

export default function Sidebar() {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(""); // chỉ 1 menu mở

  const toggleMenu = (menu) => {
    setOpenMenu((prev) => (prev === menu ? "" : menu));
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <Link to="/home">🏠 WarehouseSys</Link>
      </div>

      <nav className="sidebar-menu">
        {/* === WAREHOUSE === */}
        <div className="menu-section">
          <div
            className={`menu-title clickable ${
              openMenu === "warehouse" ? "open" : ""
            }`}
            onClick={() => toggleMenu("warehouse")}
          >
            <span>📦 Warehouse</span>
            <span className="arrow">▶</span>
          </div>

          <div
            className={`submenu-container ${
              openMenu === "warehouse" ? "open" : ""
            }`}
          >
            <Link
              to="/warehouse/labelprint"
              className={`submenu-item ${
                isActive("/warehouse/labelprint") ? "active" : ""
              }`}
            >
              Label Print
            </Link>
            <Link
              to="/warehouse/consumablein"
              className={`submenu-item ${
                isActive("/warehouse/consumablein") ? "active" : ""
              }`}
            >
              Consumable In
            </Link>
            <Link
              to="/warehouse/consumableout"
              className={`submenu-item ${
                isActive("/warehouse/consumableout") ? "active" : ""
              }`}
            >
              Consumable Out
            </Link>
            <Link
              to="/warehouse/consumableter"
              className={`submenu-item ${
                isActive("/warehouse/consumableter") ? "active" : ""
              }`}
            >
              Consumable Ter
            </Link>
          </div>
        </div>

        {/* === MACHINE === */}
        <div className="menu-section">
          <div
            className={`menu-title clickable ${
              openMenu === "machine" ? "open" : ""
            }`}
            onClick={() => toggleMenu("machine")}
          >
            <span>⚙️ Machine</span>
            <span className="arrow">▶</span>
          </div>

          <div
            className={`submenu-container ${
              openMenu === "machine" ? "open" : ""
            }`}
          >
            <Link
              to="/machine/machinein"
              className={`submenu-item ${
                isActive("/machine/machinein") ? "active" : ""
              }`}
            >
              Machine In
            </Link>
            <Link
              to="/machine/machineout"
              className={`submenu-item ${
                isActive("/machine/machineout") ? "active" : ""
              }`}
            >
              Machine Out
            </Link>
          </div>
        </div>

        {/* === ADMIN === */}
        <div className="menu-section">
          <div
            className={`menu-title clickable ${
              openMenu === "admin" ? "open" : ""
            }`}
            onClick={() => toggleMenu("admin")}
          >
            <span>👤 Admin</span>
            <span className="arrow">▶</span>
          </div>

          <div
            className={`submenu-container ${
              openMenu === "admin" ? "open" : ""
            }`}
          >
            <Link
              to="/admin/user"
              className={`submenu-item ${
                isActive("/admin/user") ? "active" : ""
              }`}
            >
              User
            </Link>
            <Link
              to="/admin/consumablespec"
              className={`submenu-item ${
                isActive("/admin/consumablespec") ? "active" : ""
              }`}
            >
              Consumable Spec
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
