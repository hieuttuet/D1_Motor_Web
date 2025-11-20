import "./header.css";
import { useAuth } from "../../hooks/useAuth.jsx";
import { FaSignOutAlt, FaUser  } from "react-icons/fa";
export default function Header() {
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

        <div className="search-box">
          <input
            type="text"
            placeholder="Search..."
            className="search-input"
          />
        </div>
      </div>

      <div className="header-right">
        <span className="user-info">
          <FaUser style={{ marginRight: 6 }} />
           {auth?.user?.full_name || "Guest"}
        </span>
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt style={{ marginRight: "6px" }} /> Logout
        </button>
      </div>
    </header>
  );
}
