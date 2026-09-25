import { useEffect, useState } from "react";
import {
  adminListUsers,
  adminUpdateUserRole,
  adminDeleteUser,
} from "../../api/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import Loader from "../../components/Loader.jsx";

export default function AdminUsers() {
  const { token, user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminListUsers(token, search);
      setUsers(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const toggleRole = async (u) => {
    const newRole = u.role === "admin" ? "user" : "admin";
    if (!window.confirm(`Change ${u.name}'s role to ${newRole}?`)) return;
    try {
      await adminUpdateUserRole(token, u.id, newRole);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const removeUser = async (u) => {
    if (!window.confirm(`Delete ${u.name} (${u.email})? This cannot be undone.`)) return;
    try {
      await adminDeleteUser(token, u.id);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h1>Users</h1>

      <div className="toolbar" style={{ marginTop: "1rem" }}>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && <div className="form-error">{error}</div>}

      {loading ? (
        <Loader />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone || "—"}</td>
                  <td>
                    <span
                      className={`badge ${
                        u.role === "admin" ? "badge-found" : "badge-category"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => toggleRole(u)}
                      disabled={u.id === me?.id}
                      title={u.id === me?.id ? "You cannot change your own role" : ""}
                    >
                      {u.role === "admin" ? "Demote" : "Make Admin"}
                    </button>{" "}
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => removeUser(u)}
                      disabled={u.id === me?.id}
                      title={u.id === me?.id ? "You cannot delete yourself" : ""}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", color: "var(--muted)" }}>
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}