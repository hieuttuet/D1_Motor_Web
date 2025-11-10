import { Link, useLocation } from "react-router-dom";
import "../../styles/sidebar.css";
import { useState } from "react";
import { FaChevronRight, FaChevronLeft, FaBars } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth.jsx";

export default function Sidebar({ onToggle }) {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const { auth } = useAuth();
  const userRole = auth?.user?.role;

  const toggleMenu = (menu) => {
    setOpenMenu((prev) => (prev === menu ? "" : menu));
  };

  const toggleSidebar = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    onToggle?.(newState);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* === Nút thu gọn/mở rộng === */}
      <button className="btn-toggle" onClick={toggleSidebar}> {collapsed ? <FaChevronRight /> : <FaChevronLeft />} </button>
      {/* Ẩn toàn bộ nội dung khi collapsed */}
      {!collapsed && (
        <>
          <div className="sidebar-logo">
            <Link to="/home">PARTRON</Link>
          </div>

          <nav className="sidebar-menu">
            {/* === WAREHOUSE === */}
            <div className="menu-section">
              <div
                className={`menu-title ${openMenu === "warehouse" ? "open" : ""}`}
                onClick={() => toggleMenu("warehouse")}
              >
                <span>Warehouse</span>
                <FaChevronRight className="arrow" />
              </div>

              <div className={`submenu-container ${openMenu === "warehouse" ? "open" : ""}`}>
                <Link
                  to="/warehouse/labelprint"
                  className={`submenu-item ${isActive("/warehouse/labelprint") ? "active" : ""}`}
                >
                  Label Print
                </Link>
                <Link
                  to="/warehouse/consumablein"
                  className={`submenu-item ${isActive("/warehouse/consumablein") ? "active" : ""}`}
                >
                  Consumable In
                </Link>
                <Link
                  to="/warehouse/consumableout"
                  className={`submenu-item ${isActive("/warehouse/consumableout") ? "active" : ""}`}
                >
                  Consumable Out
                </Link>
                <Link
                  to="/warehouse/consumableter"
                  className={`submenu-item ${isActive("/warehouse/consumableter") ? "active" : ""}`}
                >
                  Consumable Ter
                </Link>
              </div>
            </div>

            {/* === MACHINE === */}
            <div className="menu-section">
              <div
                className={`menu-title ${openMenu === "machine" ? "open" : ""}`}
                onClick={() => toggleMenu("machine")}
              >
                <span>Machine</span>
                <FaChevronRight className="arrow" />
              </div>

              <div className={`submenu-container ${openMenu === "machine" ? "open" : ""}`}>
                <Link
                  to="/machine/machinein"
                  className={`submenu-item ${isActive("/machine/machinein") ? "active" : ""}`}
                >
                  Machine In
                </Link>
                <Link
                  to="/machine/machineout"
                  className={`submenu-item ${isActive("/machine/machineout") ? "active" : ""}`}
                >
                  Machine Out
                </Link>
              </div>
            </div>

            {/* === ADMIN === */}
            {userRole === "Manager" && (
              <div className="menu-section">
                <div
                  className={`menu-title ${openMenu === "admin" ? "open" : ""}`}
                  onClick={() => toggleMenu("admin")}
                >
                  <span>Admin</span>
                  <FaChevronRight className="arrow" />
                </div>

                <div className={`submenu-container ${openMenu === "admin" ? "open" : ""}`}>
                  <Link
                    to="/admin/users"
                    className={`submenu-item ${isActive("/admin/users") ? "active" : ""}`}
                  >
                    User
                  </Link>
                  <Link
                    to="/admin/consumable-specs"
                    className={`submenu-item ${isActive("/admin/consumablespec") ? "active" : ""}`}
                  >
                    Consumable Spec
                  </Link>
                </div>
              </div>
            )}
          </nav>
        </>
      )}
    </div>
  );
}
