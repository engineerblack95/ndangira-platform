import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { user, token } = await register(form.name, form.email, form.password);
      signIn(user, token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <h2>Create Account</h2>

      {error ? <div className="form-error">{error}</div> : null}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full name</label>
          <input name="name" value={form.name} onChange={handle} placeholder="Your name" />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handle} placeholder="you@example.com" />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" value={form.password} onChange={handle} placeholder="At least 4 characters" />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Creating..." : "Register"}
          </button>
        </div>
      </form>

      <p style={{ textAlign: "center", marginTop: "1rem", color: "var(--muted)" }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}