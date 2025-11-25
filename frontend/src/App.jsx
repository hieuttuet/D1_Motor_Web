import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/login.jsx";
import Layout from "./components/Main/Layout.jsx";
import Home from "./pages/Home/Home.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import AdminUser from "./pages/Admin/User/UserManagement.jsx";
import ConsumableSpec from "./pages/Admin/ConsumableSpec/ConsumableSpec.jsx";
import ConsumableLabelPrint from "./pages/Warehouse/LabelPrint/ConsumableLabelPrint.jsx";
import InventoryHistory from "./pages/Warehouse/History/InventoryHistory.jsx";


function App() {
  return (
    <>
      <Routes>
        {/* Đường dẫn Login */}
        <Route path="/login" element={<Login />} />

        {/* Đường dẫn Routes có bảo vệ */}
        <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route path="/home" element={<Home />} />
          <Route path="/warehouse/consumable-label-print" element={<ConsumableLabelPrint />} />
          <Route path="/warehouse/inventory-history" element={<InventoryHistory />} />
          <Route path="/admin/users" element={<AdminUser />} />
          <Route path="/admin/consumable-specs" element={<ConsumableSpec />} />
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
