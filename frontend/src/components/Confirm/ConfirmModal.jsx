// ConfirmModal.jsx
import React from "react";
import ReactDOM from "react-dom";
import "./confirmModal.css";
import { FaExclamationCircle } from "react-icons/fa";

export default function ConfirmModal({ show, title = "Thông báo", message, onConfirm, onCancel }) {
  if (!show) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <FaExclamationCircle className="modal-icon" />
          <div className="modal-title">{title}</div>
        </div>

        <div className="modal-message">{message}</div>

        <div className="modal-buttons">
          <button className="btn-ok" onClick={onConfirm}>OK</button>
          <button className="btn-cancel" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>,
    document.body
  );
}
