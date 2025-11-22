import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./userManagement.css";

export default function UserFormModal({ onClose, onSave, editUser }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    user_name: "",
    password: "",
    full_name: "",
    role: "Staff",
  });

  useEffect(() => {
    if (editUser) setForm(editUser);
  }, [editUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{editUser ? t("admin-users.modal.title-edit") : t("admin-users.modal.title-add")}</h3>
        <form onSubmit={handleSubmit}>
          <div className="modal-line">
            <label>{t("admin-users.modal.label-username")}</label>
            <input
              name="user_name"
              value={form.user_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="modal-line">
            <label>{t("admin-users.modal.label-password")}</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="modal-line">
            <label>{t("admin-users.modal.label-full_name")}</label>
            <input
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="modal-line">
            <label>{t("admin-users.modal.label-role")}</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option>Manager</option>
              <option>Staff</option>
            </select>
          </div>
          <div className="modal-buttons">
            <button type="submit" className="btn-save">{t("admin-users.modal.button-save")}</button>
            <button type="button" className="btn-cancel" onClick={onClose}>{t("admin-users.modal.button-cancel")}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
