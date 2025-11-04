import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login/login.jsx";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home/Home.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";

function App() {
  return (
    <Routes>
      {/* Đường dẫn Login */}
      <Route path="/login" element={<Login />} />

      {/* Đường dẫn Home có bảo vệ */}
      <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route path="/home" element={<Home />} />
        </Route>

      {/* Mặc định redirect "/" → "/login" */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
