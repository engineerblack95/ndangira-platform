import { useEffect, useState } from "react";
import { adminGetStats } from "../../api/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import Loader from "../../components/Loader.jsx";

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await adminGetStats(token);
        setStats(data);
      } catch (err) {
        setError(err.message);
      }
    })();
  }, [token]);

  if (error) return <div className="form-error">{error}</div>;
  if (!stats) return <Loader />;

  const cards = [
    { label: "Total Users", value: stats.users },
    { label: "Lost Items", value: stats.lostItems },
    { label: "Found Items", value: stats.foundItems },
    { label: "Claims", value: stats.claims },
    { label: "Resolved", value: stats.resolved },
  ];

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
        Overview of the Ndangira platform.
      </p>
      <div className="admin-stats-grid">
        {cards.map((c) => (
          <div key={c.label} className="admin-stat-card">
            <div className="admin-stat-value">{c.value}</div>
            <div className="admin-stat-label">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}