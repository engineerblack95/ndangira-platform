import { useEffect, useState } from "react";
import { adminListItems, adminUpdateItemStatus } from "../../api/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import Loader from "../../components/Loader.jsx";

export default function AdminItems() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminListItems(token, { search, type, status });
      setItems(data);
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
  }, [search, type, status]);

  const changeStatus = async (item, newStatus) => {
    try {
      await adminUpdateItemStatus(token, item.id, newStatus);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h1>Items</h1>

      <div className="toolbar" style={{ marginTop: "1rem" }}>
        <input
          type="text"
          placeholder="Search title or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All types</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="open">Open</option>
          <option value="resolved">Resolved</option>
          <option value="claimed">Claimed</option>
        </select>
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
                <th>Image</th>
                <th>Type</th>
                <th>Title</th>
                <th>Category</th>
                <th>Location</th>
                <th>Reporter</th>
                <th>Status</th>
                <th>Change status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id}>
                  <td>{it.id}</td>
                  <td>
                    {it.images && it.images.length > 0 ? (
                      <img src={it.images[0]} alt="" className="admin-thumb" />
                    ) : (
                      <span style={{ color: "var(--muted)" }}>—</span>
                    )}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        it.type === "lost" ? "badge-lost" : "badge-found"
                      }`}
                    >
                      {it.type}
                    </span>
                  </td>
                  <td>{it.title}</td>
                  <td>{it.category}</td>
                  <td>{it.location}</td>
                  <td>{it.reporter_name || "—"}</td>
                  <td>
                    <span
                      className={`badge ${
                        it.status === "open" ? "badge-category" : "badge-found"
                      }`}
                    >
                      {it.status}
                    </span>
                  </td>
                  <td>
                    <select
                      value={it.status}
                      onChange={(e) => changeStatus(it, e.target.value)}
                      style={{ fontSize: "0.85rem", padding: "0.3rem" }}
                    >
                      <option value="open">open</option>
                      <option value="claimed">claimed</option>
                      <option value="resolved">resolved</option>
                    </select>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center", color: "var(--muted)" }}>
                    No items found
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