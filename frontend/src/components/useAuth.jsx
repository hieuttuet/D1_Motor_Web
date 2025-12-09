import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
const AuthContext = createContext();
export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation(); // dùng để trigger check khi route thay đổi
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem("auth");
    return saved ? JSON.parse(saved) : null;
  });

  const timerRef = useRef(null);
  const idleTimer = useRef(null);
  const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 phút
  const resetIdleTimer = () => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      setAuth(null);
        localStorage.removeItem("auth");
        navigate("/login", { replace: true });
    }, IDLE_TIMEOUT);
  };
   // --- Theo dõi hoạt động của user ---
  useEffect(() => {
    const events = ["mousemove", "keydown", "mousedown", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetIdleTimer));

    resetIdleTimer(); // bắt đầu timer khi load

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetIdleTimer));
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [auth]);
  // --- 1. Lưu auth vào localStorage ---
  useEffect(() => {
    if (auth) localStorage.setItem("auth", JSON.stringify(auth));
    else localStorage.removeItem("auth");
  }, [auth]);

  // --- 2. Kiểm tra token expired mọi lúc ---
  useEffect(() => {
    if (auth?.token?.expires_at) {
      const expireTime = new Date(auth.token.expires_at).getTime();
      const now = Date.now();

      if (now > expireTime) {
        setAuth(null);
        localStorage.removeItem("auth");
        navigate("/login", { replace: true });
        return;
      }

      // Hẹn giờ auto logout
      const remaining = expireTime - now;
      timerRef.current = setTimeout(() => {
        setAuth(null);
        localStorage.removeItem("auth");
        navigate("/login", { replace: true });
      }, remaining);

      return () => clearTimeout(timerRef.current);
    }
  }, [auth, location.pathname]); // chạy lại khi auth hoặc route thay đổi

  // --- 3. Đồng bộ auth giữa các tab ---
  useEffect(() => {
    const syncHandler = (e) => {
      if (e.key === "auth") setAuth(e.newValue ? JSON.parse(e.newValue) : null);
    };
    window.addEventListener("storage", syncHandler);
    return () => window.removeEventListener("storage", syncHandler);
  }, []);

  // --- 4. Login / Logout ---
  const login = (data) => setAuth(data);
  const logout = () => {
    setAuth(null);
    localStorage.removeItem("auth");
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}


// Hook tiện dụng để gọi trong component khác
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
