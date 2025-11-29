import "./header.css";
import { useAuth } from "../../hooks/useAuth.jsx";
import { FaSignOutAlt, FaUser } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/LanguageSwitcher/LanguageSwitcher.jsx";
export default function Header() {
  const { t } = useTranslation();
  const { auth, logout } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("token");
    logout();
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo-box">
          <img src="/partron_icon.ico" alt="logo" className="logo" />
        </div>
      </div>

      <div className="header-right">
        {/* Ngôn ngữ */}
        <div className="header-language">
          <LanguageSwitcher />
        </div>
        <div className="header-language">
          <LanguageSwitcher />
        </div>
        <span className="user-info">
          <FaUser style={{ marginRight: 6 }} />
          {auth?.user?.full_name || "Guest"}
        </span>
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt style={{ marginRight: "6px" }} /> {t("header.logout")}
        </button>
      </div>
    </header>
  );
}
