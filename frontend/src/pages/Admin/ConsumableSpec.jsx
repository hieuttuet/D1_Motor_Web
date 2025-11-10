import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth.jsx";
import "../../styles/consumableSpec.css";
import {
  getConsumables,
  addConsumable,
  updateConsumable,
  deleteConsumable,
} from "../../api/admin/consumableApi.js";

export default function ConsumableSpec() {
  const { auth } = useAuth();
  const [consumables, setConsumables] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    consumable_spec_id: "",
    consumable_type: "",
    description: "",
    expiration: "",
    event_user: auth.user.user_name || "",
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' }); // sắp xếp


  // ====== LẤY DỮ LIỆU BAN ĐẦU ======
  useEffect(() => {
    document.title = "Consumable Spec Management";
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await getConsumables();
      setConsumables(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching consumables:", err);
    }
  };

  // ====== HANDLE ======
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelect = (item) => {
    setSelected(item);
    setForm({ ...item });
  };

  const handleAdd = async () => {
    if (!form.consumable_spec_id || !form.consumable_type) {
      alert("⚠️ Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    try {
      const payload = { ...form, event_user: auth.user.user_name};
      await addConsumable(payload);
      await fetchData();
      resetForm();
    } catch (err) {
      console.error("Add error:", err);
    }
  };

  const handleEdit = async () => {
    if (!selected) return alert("⚠️ Chọn 1 item để sửa!");
    try {
      const payload = { ...form, event_user: auth.user.user_name};
      console.error("log update :", payload);
      await updateConsumable(payload);
      await fetchData();
      resetForm();
    } catch (err) {
      console.error("Edit error:", err);
    }
  };

  const handleDelete = async () => {
    if (!selected) return alert("⚠️ Chọn 1 item để xóa!");
    if (!window.confirm("🗑 Bạn có chắc muốn xóa item này?")) return;
    try {
      await deleteConsumable(selected.consumable_spec_id);
      await fetchData();
      resetForm();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const resetForm = () => {
    setSelected(null);
    setForm({
      consumable_spec_id: "",
      consumable_type: "",
      description: "",
      expiration: "",
      event_user: auth.user.user_name || "",
    });
  };
  // ====== SORT ======
  const handleSort = (key) => {
  let direction = 'asc';
  if (sortConfig.key === key && sortConfig.direction === 'asc') {
    direction = 'desc';
  }
  setSortConfig({ key, direction });

  const sorted = [...consumables].sort((a, b) => {
    if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
    return 0;
  });
  setConsumables(sorted);
};
 
  // ====== RENDER ======
  return (
    <div className="consumable-container">
      {/* === DANH SÁCH TRÁI === */}
      <div className="consumable-list">
        <h2>Danh sách Consumable</h2>
        <div className="table-wrapper">
          <table>
          <thead>
            <tr>
              <th onClick={() => handleSort("consumable_spec_id")}>Consumable ID</th>
              <th onClick={() => handleSort("consumable_type")}>Consumable Type</th>
              <th onClick={() => handleSort("description")}>Description</th>
              <th onClick={() => handleSort("expiration")}>Expiration</th>
            </tr>
          </thead>
          <tbody>
            {consumables.map((item) => (
              <tr
                key={item.consumable_spec_id}
                className={
                  selected?.consumable_spec_id === item.consumable_spec_id
                    ? "selected"
                    : ""
                }
                onClick={() => handleSelect(item)}
              >
                <td>{item.consumable_spec_id}</td>
                <td>{item.consumable_type}</td>
                <td>{item.description}</td>
                <td>{item.expiration}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* === FORM PHẢI === */}
      <div className="consumable-form">
        <h2>Thông tin chi tiết</h2>

        <div className="form-section">
          <div className="form-row">
            <label>ID</label>
            <input
              name="consumable_spec_id"
              value={form.consumable_spec_id}
              onChange={handleChange}
              placeholder="VD: CNSM001"
            />

          </div>

          <div className="form-row">
            <label>Type</label>
            <input
              name="consumable_type"
              value={form.consumable_type}
              onChange={handleChange}
              placeholder="VD: Tape, Paste..."
            />
          </div>

          <div className="form-row">
            <label>Description</label>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Mô tả chi tiết"
            />
          </div>

          <div className="form-row">
            <label>Expiration</label>
            <input
              name="expiration"
              type="text"
              value={form.expiration}
              onChange={handleChange}
              placeholder="VD: 12 months"
            />
          </div>
        </div>

        {/* Nút hành động */}
        <div className="button-group">
          <button className="add-btn" onClick={handleAdd}>
            ➕ Add
          </button>
          <button className="edit-btn" onClick={handleEdit}>
            ✏️ Edit
          </button>
          <button className="delete-btn" onClick={handleDelete} >
            🗑 Delete
          </button>
        </div>
      </div>
    </div>
  );
}
