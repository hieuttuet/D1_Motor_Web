import { createContext, useContext, useState, useEffect } from "react";

// Tạo context lưu thông tin đăng nhập
const AuthContext = createContext();

// Component Provider bao quanh App
export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
  const savedAuth = sessionStorage.getItem("auth");
  return savedAuth ? JSON.parse(savedAuth) : null;
});

useEffect(() => {
  if (auth) sessionStorage.setItem("auth", JSON.stringify(auth));
  else sessionStorage.removeItem("auth");
}, [auth]);


  const login = (data) => setAuth(data);
  const logout = () => setAuth(null);

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
