import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route, Navigate, useLocation  } from "react-router-dom";
import Login from "./pages/Login/Login.jsx";
import Layout from "./components/Main/Layout.jsx";
import Home from "./pages/Home/Home.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import AdminUser from "./pages/Admin/User/UserManagement.jsx";
import ConsumableSpec from "./pages/Admin/ConsumableSpec/ConsumableSpec.jsx";
import ConsumableLabelPrint from "./pages/Warehouse/LabelPrint/ConsumableLabelPrint.jsx";
import ConsumableMove from "./pages/Warehouse/Move/ConsumableMove.jsx";
import ConsumableHistory from "./pages/Warehouse/History/ConsumableHistory.jsx";
import MachinesInputs from "./pages/Machine/Input/MachinesInput.jsx";
import MachinesHistory from "./pages/Machine/History/MachinesHistory.jsx";


function App() {
  const location = useLocation();
  return (
    <>
      <Routes>
        {/* Đường dẫn Login */}
        <Route path="/login" element={<Login />} />

        {/* Đường dẫn Routes có bảo vệ */}
        <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route path="/home" element={<Home />} />
          <Route path="/warehouse/consumable-label-print" element={<ConsumableLabelPrint key={location.key}/>} />
          <Route path="/warehouse/consumable-move" element={<ConsumableMove key={location.key}/>} />
          <Route path="/warehouse/consumable-history" element={<ConsumableHistory key={location.key}/>} />

          <Route path="/machines/machines-input" element={<MachinesInputs key={location.key}/>} />
          <Route path="/machines/machines-history" element={<MachinesHistory key={location.key}/>} />

          <Route path="/admin/users" element={<AdminUser key={location.key}/>} />
          <Route path="/admin/consumable-specs" element={<ConsumableSpec key={location.key}/>} />
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
