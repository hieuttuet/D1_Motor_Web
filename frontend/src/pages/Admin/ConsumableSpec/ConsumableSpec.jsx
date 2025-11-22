  import React, { useEffect, useState } from "react";
  import "./consumableSpec.css";
  import {
    getConsumables,
    addConsumable,
    updateConsumable,
    deleteConsumable,
  } from "../../../api/admin/consumableApi.js";
  import { showMessage  } from "../../../components/Notification/messageService.jsx";

  export default function ConsumableSpec() {
    const [consumables, setConsumables] = useState([]);
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState({
      consumable_spec_id: "",
      consumable_code: "",
      consumable_type: "",
      description: "",
      expiration: "",
    });
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' }); // sắp xếp


    // ====== LẤY DỮ LIỆU BAN ĐẦU ======
    useEffect(() => {
      document.title = "Consumable Spec Management";
      fetchData();
    }, []);

    const fetchData = async () => {
      try {
        const res = await getConsumables();
        if (!res.data.success) {
          await showMessage(res.data.message, "error");
          return;
        } 
        setConsumables(res.data.info);
      } catch (err) {
        if (err.response) {
        showMessage(err.response.data.message ,"error");
        } else {
        showMessage("Không thể kết nối server.", "error");
        }
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
      if (!form.consumable_code || !form.consumable_type || !form.description || !form.expiration) {
        alert("⚠️ Vui lòng nhập đầy đủ thông tin!");
        return;
      }
      try {
        const res = await addConsumable(form);
        if (!res.data.success) {
          await showMessage(res.data.message, "error");
          return;
        }
        await fetchData();
        resetForm();
        await showMessage(res.data.message, "success");
      } catch (err) {
        if (err.response) {
        showMessage(err.response.data.message ,"error");
        } else {
        showMessage("Không thể kết nối server.", "error");
        }
      }
    };

    const handleEdit = async () => {
      if (!selected) return alert("⚠️ Chọn 1 item để sửa!");
      try {
        const res = await updateConsumable(form);
        if(!res.data.success) {
          await showMessage(res.data.message, "error");
          return;
        }
        await fetchData();
        resetForm();
        await showMessage(res.data.message, "success");
      } catch (err) {
        if (err.response) {
        showMessage(err.response.data.message ,"error");
        } else {
        showMessage("Không thể kết nối server.", "error");
        }
      }
    };

    const handleDelete = async () => {
      if (!selected) return alert("⚠️ Chọn 1 item để xóa!");
      if (!window.confirm("🗑 Bạn có chắc muốn xóa item này?")) return;
      try {
        const res = await deleteConsumable(selected.consumable_spec_id);
        if (!res.data.success) {
          await showMessage(res.data.message, "error");
          return;
        }
        await fetchData();
        resetForm();
        await showMessage(res.data.message, "success");
      } catch (err) {
        if (err.response) {
        showMessage(err.response.data.message ,"error");
        } else {
        showMessage("Không thể kết nối server.", "error");
        }
      }
    };

    const resetForm = () => {
      setSelected(null);
      setForm({
        consumable_spec_id: "",
        consumable_code: "",
        consumable_type: "",
        description: "",
        expiration: "",
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
            <table className="consumable-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("consumable_code")}>Consumable Code</th>
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
                  <td>{item.consumable_code}</td>
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
              <label>Consumable Code :</label>
              <input
                name="consumable_code"
                value={form.consumable_code}
                onChange={handleChange}
                placeholder="VD: CNSM001"
              />

            </div>

            <div className="form-row">
              <label>Consumable Type :</label>
              <input
                name="consumable_type"
                value={form.consumable_type}
                onChange={handleChange}
                placeholder="VD: Tape, Paste..."
              />
            </div>

            <div className="form-row">
              <label>Description :</label>
              <input
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Mô tả chi tiết"
              />
            </div>

            <div className="form-row">
              <label>Expiration :</label>
              <input
                name="expiration"
                type="number"
                min="0"
                value={form.expiration}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setForm((prev) => ({ ...prev, expiration: value }));
                }}
                placeholder="VD: 12"
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
