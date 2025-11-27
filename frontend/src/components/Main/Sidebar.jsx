import { Link, useLocation } from "react-router-dom";
import "./sidebar.css";
import { useState } from "react";
import partronHome from "../../assets/icons/partron_home.png";
import { FaChevronRight, FaChevronLeft, FaBars } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useTranslation } from "react-i18next";

export default function Sidebar({ onToggle }) {
  const { t } = useTranslation();
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
            <Link to="/home" className="logo-link"><img src={partronHome} alt="Logo" /></Link>
          </div>

          <nav className="sidebar-menu">
            {/* === WAREHOUSE === */}
            <div className="menu-section">
              <div
                className={`menu-title ${openMenu === "warehouse" ? "open" : ""}`}
                onClick={() => toggleMenu("warehouse")}
              >
                <span>{t("sidebar.warehouses")}</span>
                <FaChevronRight className="arrow" />
              </div>

              <div className={`submenu-container ${openMenu === "warehouse" ? "open" : ""}`}>
                <Link
                  to="/warehouse/consumable-label-print"
                  className={`submenu-item ${isActive("/warehouse/consumable-label-print") ? "active" : ""}`}
                >
                  {t("sidebar.warehouses_label_print")}
                </Link>
                <Link
                  to="/warehouse/consumablemove"
                  className={`submenu-item ${isActive("/warehouse/consumablemove") ? "active" : ""}`}
                >
                  {t("sidebar.warehouses_move")}
                </Link>
                <Link
                  to="/warehouse/consumable-history"
                  className={`submenu-item ${isActive("/warehouse/consumable-history") ? "active" : ""}`}
                >
                  {t("sidebar.warehouses_history")}
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
                  <span>{t("sidebar.admin")}</span>
                  <FaChevronRight className="arrow" />
                </div>

                <div className={`submenu-container ${openMenu === "admin" ? "open" : ""}`}>
                  <Link
                    to="/admin/users"
                    className={`submenu-item ${isActive("/admin/users") ? "active" : ""}`}
                  >
                    {t("sidebar.admin_users")}
                  </Link>
                  <Link
                    to="/admin/consumable-specs"
                    className={`submenu-item ${isActive("/admin/consumable-specs") ? "active" : ""}`}
                  >
                    {t("sidebar.admin_consumable_specs")}
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
