import { NavLink } from "react-router-dom";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-wrap">
      <aside className="admin-sidebar">
        <h3>Admin Panel</h3>
        <nav>
          <NavLink to="/admin" end>📊 Dashboard</NavLink>
          <NavLink to="/admin/users">👥 Users</NavLink>
          <NavLink to="/admin/items">📦 Items</NavLink>
        </nav>
      </aside>
      <section className="admin-content">{children}</section>
    </div>
  );
}