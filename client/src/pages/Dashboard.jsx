import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState("posts");

  return (
    <div>
      <h1 style={{ marginBottom: "0.25rem" }}>Dashboard</h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
        Welcome back, {user?.name}.
      </p>

      <div className="tabs">
        <button className={`tab ${tab === "posts" ? "active" : ""}`} onClick={() => setTab("posts")}>My Posts</button>
        <button className={`tab ${tab === "claims" ? "active" : ""}`} onClick={() => setTab("claims")}>My Claims</button>
        <button className={`tab ${tab === "profile" ? "active" : ""}`} onClick={() => setTab("profile")}>Profile</button>
      </div>

      {tab === "posts" && (
        <div className="empty">
          <h3>You have not posted anything yet</h3>
          <p>Start by reporting a lost or found item.</p>
          <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            <Link to="/report-lost" className="btn btn-primary">Report Lost</Link>
            <Link to="/report-found" className="btn btn-outline">Report Found</Link>
          </div>
        </div>
      )}

      {tab === "claims" && (
        <div className="empty">
          <h3>No claims yet</h3>
          <p>When you claim an item, it will appear here.</p>
        </div>
      )}

      {tab === "profile" && (
        <div className="form-card" style={{ maxWidth: 500, margin: 0 }}>
          <h3 style={{ marginBottom: "1rem" }}>Profile</h3>
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong> {user?.role}</p>
        </div>
      )}
    </div>
  );
}