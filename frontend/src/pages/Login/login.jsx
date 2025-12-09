import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { loginUser } from "../../api/login/login.js";
import { useAuth } from "../../components/useAuth.jsx";
import "./login.css";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import partronLoginImg from "../../assets/icons/partron_login.png";
import bgLogin from "../../assets/icons/bg_login.png";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/LanguageSwitcher/LanguageSwitcher.jsx";


export default function Login() {
  const [user_name, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Thêm state này
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
  document.title = "Login Page";
}, []);

  useEffect(() => {
    const saveUsername = localStorage.getItem("rememberedUsername");
    if (saveUsername) {
      setUsername(saveUsername);
      setRememberMe(true);
    }
  }, []);
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      const resp = await loginUser({ user_name, password });
      if (!resp.data.success) {
        setErrorMsg(resp.data.message || "Đăng nhập thất bại.");
        return;
      }
      // Giả sử API trả về { token, user }
      const { token, user } = resp.data.info;

      // 1) Lưu username nếu remember
      if (rememberMe) localStorage.setItem("rememberedUsername", user_name);
      else localStorage.removeItem("rememberedUsername");

      // 2) Cập nhật context/auth (ví dụ lưu token trong memory/context)
      login({ user, token });

      // 3) Điều hướng
      navigate("/home");
    } catch (err) {
      if (err.response) {
      setErrorMsg(err.response.data.message || "Lỗi xác thực!");
      } else {
      setErrorMsg("Không thể kết nối server.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="login-background" style={{ backgroundImage: `url(${bgLogin})` }}>
        <div className="login-box">
          {/* Ngôn ngữ */}
          <div className="login-language">
            <LanguageSwitcher />
          </div>
          <form className="login-form" onSubmit={handleLogin}>
            <img src={partronLoginImg} alt="Member login" className="login-title" />

            <div className="input-group">
              <span className="icon"><FaUser /></span>
              <input
                type="username"
                value={user_name}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder={t("login.username")}
              />
            </div>

            <div className="input-group">
              <span className="icon"><FaLock /></span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder={t("login.password")}
              />
              <span
                className="icon"
                style={{ cursor: "pointer", marginLeft: 8 }}
                onClick={() => setShowPassword((prev) => !prev)}
                title={showPassword ? t("login.hide_password") : t("login.show_password")}
              >
                {showPassword ?  <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="login-options">
              <label>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                /> {t("login.remember_me")}
              </label>
            </div>
            <button type="submit" disabled={loading}>
              {loading ? t("login.signing_in") : t("login.sign_in")}
            </button>
            {errorMsg && <div className="error">{errorMsg}</div>}
          </form>
        </div>
      </div>

  );
}
