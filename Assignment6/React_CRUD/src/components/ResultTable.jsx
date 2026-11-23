import { useState, useEffect } from "react";

/**
 * ResultTable Component
 * - Nhận props: keyword (từ khóa lọc), user (user mới cần thêm),
 *               onAdded (callback sau khi thêm xong)
 * - Tải dữ liệu từ API jsonplaceholder khi mount
 * - Lọc theo keyword (name, username)
 * - Hỗ trợ Sửa (modal form) và Xóa người dùng
 */
function ResultTable({ keyword, user, onAdded }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  // Tải dữ liệu 1 lần khi component mount
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  // Khi prop user thay đổi → thêm vào danh sách users
  useEffect(() => {
    if (user) {
      setUsers((prev) => [...prev, { ...user, id: prev.length + 1 }]);
      onAdded();
    }
  }, [user]);

  // Lọc danh sách theo keyword (name, username)
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(keyword.toLowerCase()) ||
      u.username.toLowerCase().includes(keyword.toLowerCase())
  );

  // Sửa: Deep copy user sang state editing (tránh thay đổi dữ liệu gốc do tham chiếu)
  function editUser(user) {
    setEditing({ ...user, address: { ...user.address } });
  }

  // Cập nhật field trong editing
  function handleEditChange(field, value) {
    if (["street", "suite", "city"].includes(field)) {
      setEditing({
        ...editing,
        address: { ...editing.address, [field]: value },
      });
    } else {
      setEditing({ ...editing, [field]: value });
    }
  }

  // Lưu sau khi chỉnh sửa
  function saveUser() {
    setUsers((prev) =>
      prev.map((u) => (u.id === editing.id ? editing : u))
    );
    setEditing(null);
  }

  // Xóa người dùng
  function removeUser(id) {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  if (loading) {
    return <p className="loading">Đang tải dữ liệu...</p>;
  }

  return (
    <div className="result-table-section">
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Website</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>
                {u.address.street}, {u.address.suite}, {u.address.city}
              </td>
              <td>{u.phone}</td>
              <td>{u.website}</td>
              <td className="actions">
                <button className="btn-edit" onClick={() => editUser(u)}>
                  Sửa
                </button>
                <button
                  className="btn-delete"
                  onClick={() => removeUser(u.id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredUsers.length === 0 && (
        <p className="no-result">Không tìm thấy người dùng nào.</p>
      )}

      {/* Modal chỉnh sửa */}
      {editing && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Sửa người dùng (ID: {editing.id})</h4>

            <label htmlFor="edit-name">Name:</label>
            <input
              id="edit-name"
              type="text"
              value={editing.name}
              onChange={(e) => handleEditChange("name", e.target.value)}
            />

            <label htmlFor="edit-username">Username:</label>
            <input
              id="edit-username"
              type="text"
              value={editing.username}
              onChange={(e) => handleEditChange("username", e.target.value)}
            />

            <label htmlFor="edit-email">Email:</label>
            <input
              id="edit-email"
              type="email"
              value={editing.email}
              onChange={(e) => handleEditChange("email", e.target.value)}
            />

            <label htmlFor="edit-street">Street:</label>
            <input
              id="edit-street"
              type="text"
              value={editing.address.street}
              onChange={(e) => handleEditChange("street", e.target.value)}
            />

            <label htmlFor="edit-suite">Suite:</label>
            <input
              id="edit-suite"
              type="text"
              value={editing.address.suite}
              onChange={(e) => handleEditChange("suite", e.target.value)}
            />

            <label htmlFor="edit-city">City:</label>
            <input
              id="edit-city"
              type="text"
              value={editing.address.city}
              onChange={(e) => handleEditChange("city", e.target.value)}
            />

            <label htmlFor="edit-phone">Phone:</label>
            <input
              id="edit-phone"
              type="text"
              value={editing.phone}
              onChange={(e) => handleEditChange("phone", e.target.value)}
            />

            <label htmlFor="edit-website">Website:</label>
            <input
              id="edit-website"
              type="text"
              value={editing.website}
              onChange={(e) => handleEditChange("website", e.target.value)}
            />

            <div className="modal-actions">
              <button className="btn-submit" onClick={saveUser}>
                Lưu
              </button>
              <button
                className="btn-cancel"
                onClick={() => setEditing(null)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultTable;
