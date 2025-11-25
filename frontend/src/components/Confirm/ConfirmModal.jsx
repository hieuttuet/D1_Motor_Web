// ConfirmModal.jsx
import React from "react";
import ReactDOM from "react-dom";
import "./confirmModal.css";
import { FaExclamationCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function ConfirmModal({ show, message, onConfirm, onCancel }) {
  const { t } = useTranslation();
  if (!show) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <FaExclamationCircle className="modal-icon" />
          <div className="modal-title">{t("modal.title-confirm")}</div>
        </div>

        <div className="modal-message">{message}</div>

        <div className="modal-buttons">
          <button className="btn-ok" onClick={onConfirm}>{t("modal.button-ok")}</button>
          <button className="btn-cancel" onClick={onCancel}>{t("modal.button-cancel")}</button>
        </div>
      </div>
    </div>,
    document.body
  );
}
