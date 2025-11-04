import "../styles/header.css";
import { useAuth } from "../hooks/useAuth.jsx";

export default function Header() {
  const { auth, logout } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("token");
    logout();
    window.location.href = "/login";
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
          👤 {auth?.user?.full_name || "Guest"}
        </span>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
