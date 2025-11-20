import { useState, useEffect } from "react";
import "./userManagement.css";

export default function UserFormModal({ onClose, onSave, editUser }) {
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
        <h3>{editUser ? "Sửa người dùng" : "Thêm người dùng"}</h3>
        <form onSubmit={handleSubmit}>
          <label>User Name</label>
          <input
            name="user_name"
            value={form.user_name}
            onChange={handleChange}
            required
          />

          <label>Mật khẩu</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <label>Full Name</label>
          <input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            required
          />
          <label>Role</label>
          <select name="role" value={form.role} onChange={handleChange}>
            <option>Manager</option>
            <option>Staff</option>
          </select>

          <div className="modal-buttons">
            <button type="submit" className="btn-save">Lưu</button>
            <button type="button" className="btn-cancel" onClick={onClose}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
}
