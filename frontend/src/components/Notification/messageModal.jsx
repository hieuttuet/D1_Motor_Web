import React, { useEffect, useState, useRef  } from "react";
import { registerMessageHandler } from "./messageService";
import { FaTimesCircle, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import "./messageModal.css";

export default function MessageModal() {
  const [visible, setVisible] = useState(false);
  const [messageData, setMessageData] = useState({ message: "", type: "error", details: null });
  const modalRef = useRef(null);

  useEffect(() => {
    registerMessageHandler(({ message, type, details }) => {
      setMessageData({ message, type, details });
      setVisible(true);
      document.body.style.overflow = "hidden";
    });
  }, []);

  const handleClose = () => {
    setVisible(false);
    document.body.style.overflow = "auto";
    if (window._onMessageModalClose) {
      window._onMessageModalClose();
      delete window._onMessageModalClose;
    }
  };
// 🔑 Khi modal mở, focus vào div modal để nhận key events
  useEffect(() => {
    if (visible && modalRef.current) {
      modalRef.current.focus();
    }
  }, [visible]);
  
  if (!visible) return null;

  const getIcon = () => {
    switch (messageData.type) {
      case "warning":
        return <FaExclamationTriangle className="message-icon warning" />;
      case "success":
        return <FaCheckCircle className="message-icon success" />;
      case "error":
      default:
        return <FaTimesCircle className="message-icon error" />;
    }
  };

  return (
    <div className="message-modal-overlay">
      <div className="message-modal-box" ref={modalRef}
        tabIndex={0} // 📌 để div nhận focus
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault(); // ngăn hành vi mặc định
            e.stopPropagation(); // ngăn lan ra các element cha
            handleClose();
          }
        }}>
        {getIcon()}
        <div>
          <p className={`message-text ${messageData.type}`}>{messageData.message}</p>
          {/* Hiển thị details nếu là error */}
          {messageData.type === "error" && messageData.details && (
            <pre className="message-details">
              {typeof messageData.details === "string"
                ? messageData.details
                : JSON.stringify(messageData.details, null, 2)}
            </pre>
          )}
        </div>
        <button className={`message-ok-button ${messageData.type}`} onClick={handleClose}>
          OK
        </button>
      </div>
    </div>
  );
}
