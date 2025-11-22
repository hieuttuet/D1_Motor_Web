import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import UserFormModal from "./UserFormModal.jsx";
import { getUsers, createUser, updateUser, deleteUser } from "../../../api/admin/userApi.js";
import "./userManagement.css";
import { useTranslation } from "react-i18next";
import { showMessage  } from "../../../components/Notification/messageService.jsx";
import { useConfirm } from "../../../components/Confirm/confirmService.jsx";
export default function UserManagement() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' }); // sắp xếp
  const { confirm, ConfirmUI } = useConfirm();
  useEffect(() => {
  document.title = "Admin Page";
}, []);
  // ✅ Lấy danh sách user từ backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsers();
        if (!res.data.success) {
          await showMessage(res.data.message, "error");
          return;
        }
        setUsers(res.data.info);
        setFilteredUsers(res.data.info);
      } catch (err) {
        if (err.response) {
        showMessage(err.response.data.message,"error");
        } else {
        showMessage("Không thể kết nối server.", "error");
        }
      }
    };
    fetchUsers();
  }, []);

  // ✅ Tìm kiếm theo tên
  useEffect(() => {
    const filtered = users.filter((u) =>
      u.user_name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [search, users]);

  // ✅ Thêm hoặc sửa user
  const handleSaveUser = async (userData) => {
    try {
      let res;
      if (editUser) {
        res = await updateUser(editUser.user_id, userData);
        if (!res.data.success) {
          await showMessage(res.data.message, "error");
          return;
        }
      } else {
        res = await createUser(userData);
        if (!res.data.success) {
          await showMessage(res.data.message, "error");
          return;
        }
      }
      if(editUser){
        await showMessage(res.data.message, "success");
      } else {
        await showMessage(res.data.message, "success");
      }
      // reload danh sách
      res = await getUsers();
      setUsers(res.data.info);

      setModalOpen(false);
      setEditUser(null);
    } catch (err) {
      if (err.response) {
      showMessage(err.response.data.message,"error");
      } else {
      showMessage("Không thể kết nối server.", "error");
      }
    }
  };

  // ✅ Xóa user
  const handleDelete = async (user_id) => {
    if (await confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      try {
        const res = await deleteUser(user_id);
        await showMessage(res.data.message, "success");
        setUsers(users.filter((u) => u.user_id !== user_id));
      } catch (err) {
        if (err.response) {
        showMessage(err.response.data.message ,"error");
        } else {
        showMessage("Không thể kết nối server.", "error");
        }
      }
    }
  };
// ====== SORT ======
  const handleSort = (key) => {
  let direction = 'asc';
  if (sortConfig.key === key && sortConfig.direction === 'asc') {
    direction = 'desc';
  }
  setSortConfig({ key, direction });

  const sorted = [...users].sort((a, b) => {
    if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
    return 0;
  });
  setUsers(sorted);
};
  return (
    <>
    {ConfirmUI}
    <div className="user-container">
      <div className="user-header">
        <h2>{t("admin-users.header")}</h2>
        <div className="user-actions">
          <input
            type="text"
            placeholder={t("admin-users.search-placeholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn-add" onClick={() => setModalOpen(true)}>
            <FaPlus /> {t("admin-users.btn-add")}
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="user-table">
        <thead>
          <tr>
            <th onClick={() => handleSort("user_name")}>{t("admin-users.table.username")}</th>
            <th onClick={() => handleSort("password")}>{t("admin-users.table.password")}</th>
            <th onClick={() => handleSort("full_name")}>{t("admin-users.table.full_name")}</th>
            <th onClick={() => handleSort("role")}>{t("admin-users.table.role")}</th>
            <th>{t("admin-users.table.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u) => (
            <tr key={u.user_id}>
              <td>{u.user_name}</td>
              <td>{u.password}</td>
              <td>{u.full_name}</td>
              <td>{u.role}</td>
              <td>
                <button className="btn-edit" onClick={() => { setEditUser(u); setModalOpen(true); }}>
                  <FaEdit />
                </button>
                <button className="btn-delete" onClick={() => handleDelete(u.user_id)}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {modalOpen && (
        <UserFormModal
          onClose={() => {
            setModalOpen(false);
            setEditUser(null);
          }}
          onSave={handleSaveUser}
          editUser={editUser}
        />
      )}
    </div>
    </>
  );
}