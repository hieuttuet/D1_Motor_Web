import { Link, useLocation } from "react-router-dom";
import "./sidebar.css";
import { useState } from "react";
// Đổi tên biến partronHome thành partronLogo cho rõ ràng
import partronLogo from "../../assets/icons/partron_home.png";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { useAuth } from "../useAuth.jsx";
import { useTranslation } from "react-i18next";
// Import Icons hiện đại (Ionicons)
import { IoCubeOutline, IoSettingsOutline, IoSpeedometerOutline } from "react-icons/io5";

export default function Sidebar({ onToggle }) {
  const { t } = useTranslation();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const { auth } = useAuth();
  const userRole = auth?.user?.role;

  const toggleMenu = (menu) => {
    // Luôn mở Sidebar nếu đang thu gọn
    if (collapsed) {
      setCollapsed(false);
      onToggle?.(false);
    }
    setOpenMenu((prev) => (prev === menu ? "" : menu));
  };

  const toggleSidebar = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    onToggle?.(newState);
  };

  const isActive = (path) => location.pathname === path;

  // Hàm kiểm tra nếu bất kỳ mục con nào đang active
  const isParentActive = (parentPath) => {
    return location.pathname.startsWith(parentPath);
  };

  // --- Hàm render Menu Title ---
  const renderMenuTitle = (menuKey, menuName, IconComponent, parentPath) => (
    <div
      // Menu cha chỉ có active-parent để đổi màu nhấn khi menu con được chọn
      className={`menu-title
        ${isParentActive(parentPath) ? 'active-parent' : ''}`
      }
      onClick={() => toggleMenu(menuKey)}
    >
      <div className="title-content">
        <IconComponent className="menu-icon" size={20} />
        <span>{menuName}</span>
      </div>
      {/* Chỉ mũi tên nhận class "open" để xoay */}
      <FaChevronRight className={`arrow ${openMenu === menuKey ? "open" : ""}`} />
    </div>
  );
  // --- END Hàm render Menu Title ---


  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* === Nút thu gọn/mở rộng (GIỮ NGUYÊN GỐC) === */}
      <button className="btn-toggle" onClick={toggleSidebar}> {collapsed ? <FaChevronRight /> : <FaChevronLeft />} </button>

      {/* LOGO (Chỉ hiển thị khi không collapsed) */}
      <div className="sidebar-logo">
        <Link to="/home" className="logo-link"><img src={partronLogo} alt="Logo" /></Link>
      </div>

      <nav className="sidebar-menu">

        {/* === WAREHOUSE === */}
        <div className="menu-section">
          {renderMenuTitle("warehouse", t("sidebar.warehouses"), IoCubeOutline, "/warehouse")}

          <div className={`submenu-container ${openMenu === "warehouse" ? "open" : ""}`}>
            <Link
              to="/warehouse/consumable-label-print"
              className={`submenu-item ${isActive("/warehouse/consumable-label-print") ? "active" : ""}`}
            >
              {t("sidebar.warehouses_label_print")}
            </Link>
            <Link
              to="/warehouse/consumable-move"
              className={`submenu-item ${isActive("/warehouse/consumable-move") ? "active" : ""}`}
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

        {/* === MACHINES === */}
        <div className="menu-section">
          {renderMenuTitle("machines", t("sidebar.machines"), IoSpeedometerOutline, "/machines")}

          <div className={`submenu-container ${openMenu === "machines" ? "open" : ""}`}>
            <Link
              to="/machines/machines-input"
              className={`submenu-item ${isActive("/machines/machines-input") ? "active" : ""}`}
            >
              {t("sidebar.machines_inputs")}
            </Link>
            <Link
              to="/machines/machines-output"
              className={`submenu-item ${isActive("/machines/machines-output") ? "active" : ""}`}
            >
              {t("sidebar.machines_outputs")}
            </Link>
            <Link
              to="/machines/machines-history"
              className={`submenu-item ${isActive("/machines/machines-history") ? "active" : ""}`}
            >
              {t("sidebar.machines_history")}
            </Link>
          </div>
        </div>

        {/* === ADMIN === */}
        {userRole === "Manager" && (
          <div className="menu-section">
            {renderMenuTitle("admin", t("sidebar.admin"), IoSettingsOutline, "/admin")}

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
    </div>
  );
}