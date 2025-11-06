import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/login.jsx";
import Layout from "./components/Main/Layout.jsx";
import Home from "./pages/Home/Home.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import AdminUser from "./pages/Admin/UserManagement.jsx";


function App() {
  return (
    <>
      <Routes>
        {/* Đường dẫn Login */}
        <Route path="/login" element={<Login />} />

        {/* Đường dẫn Home có bảo vệ */}
        <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route path="/home" element={<Home />} />
          <Route path="/admin/users" element={<AdminUser />} />
        </Route>

        {/* Mặc định redirect "/" → "/login" */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>

      {/* ✅ ToastContainer phải nằm ngoài Routes */}
      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      
    </>
  );
}

export default App;
