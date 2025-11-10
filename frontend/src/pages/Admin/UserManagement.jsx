import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import UserFormModal from "../../components/Admin/UserFormModal.jsx";
import { getUsers, createUser, updateUser, deleteUser } from "../../api/admin/userApi.js";
import "../../styles/userManagement.css";
import { toast } from 'react-toastify';
import { showError } from "../../components/Notification/errorService.jsx";
export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' }); // sắp xếp
  useEffect(() => {
  document.title = "Admin Page";
}, []);
  // ✅ Lấy danh sách user từ backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsers();
        setUsers(res.data);
        setFilteredUsers(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng:", error);
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
      if (editUser) {
        await updateUser(editUser.user_id, userData);
      } else {
        await createUser(userData);
      }
      if(editUser){
        toast.success("Cập nhật người dùng thành công!");
      } else {
        toast.success("Thêm người dùng thành công!");
      }
      // reload danh sách
      const res = await getUsers();
      setUsers(res.data);

      setModalOpen(false);
      setEditUser(null);
    } catch (error) {
      console.error("Lỗi khi lưu người dùng:", error);
      await showError("Lỗi khi cập nhật người dùng!", error);
    }
  };

  // ✅ Xóa user
  const handleDelete = async (user_id) => {
    if (confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      try {
        await deleteUser(user_id);
        toast.success("Xóa người dùng thành công!");
        setUsers(users.filter((u) => u.user_id !== user_id));
      } catch (error) {
        await showError("Lỗi khi xóa người dùng!", error);
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
    <div className="user-container">
      <div className="user-header">
        <h2>Quản lý người dùng</h2>
        <div className="user-actions">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn-add" onClick={() => setModalOpen(true)}>
            <FaPlus /> Thêm người dùng
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="user-table">
        <thead>
          <tr>
            <th onClick={() => handleSort("user_name")}>User Name</th>
            <th onClick={() => handleSort("password")}>Password</th>
            <th onClick={() => handleSort("full_name")}>Full Name</th>
            <th onClick={() => handleSort("role")}>Role</th>
            <th>Actions</th>
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
  );
}