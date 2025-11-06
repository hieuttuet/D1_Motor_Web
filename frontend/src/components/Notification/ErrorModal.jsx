// src/components/common/ErrorModal.jsx
import React, { useEffect, useState } from "react";
import { registerErrorHandler } from "./errorService";
import { FaTimesCircle } from "react-icons/fa";
import "./errorModal.css";

export default function ErrorModal() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    registerErrorHandler((msg) => {
      setMessage(msg);
      setVisible(true);
      document.body.style.overflow = "hidden"; // ❌ khóa cuộn khi popup mở
    });
  }, []);

  const handleClose = () => {
    setVisible(false);
    document.body.style.overflow = "auto"; // ✅ bật lại cuộn
    if (window._onErrorModalClose) {
      window._onErrorModalClose();
      delete window._onErrorModalClose;
    }
  };

  if (!visible) return null;

  return (
    <div className="error-modal-overlay">
      <div className="error-modal-box">
        <FaTimesCircle className="error-icon" />
        <p className="error-message">{message}</p>
        <button className="error-ok-button" onClick={handleClose}>
          OK
        </button>
      </div>
    </div>
  );
}
