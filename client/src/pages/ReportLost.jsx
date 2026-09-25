import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createItem } from "../api/api.js";
import { categories } from "../data/mockData.js";

export default function ReportLost() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: categories[0],
    location: "",
    date: "",
    reward: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    image: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title || !form.description || !form.location || !form.contactPhone) {
      setError("Please fill in title, description, location, and phone.");
      return;
    }

    setSubmitting(true);
    try {
      await createItem({
        type: "lost",
        title: form.title,
        description: form.description,
        category: form.category,
        images: form.image ? [form.image] : [],
        location: form.location,
        date: form.date || new Date().toISOString().slice(0, 10),
        reward: form.reward ? Number(form.reward) : null,
        contact: {
          name: form.contactName,
          phone: form.contactPhone,
          email: form.contactEmail,
        },
        reporterName: form.contactName,
      });
      navigate("/lost");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-card">
      <h2>Report a Lost Item</h2>

      {error ? <div className="form-error">{error}</div> : null}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title *</label>
          <input name="title" value={form.title} onChange={handle} placeholder="e.g. iPhone 13 Pro - Black" />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea name="description" value={form.description} onChange={handle} placeholder="Describe the item: color, brand, marks, contents..." />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <select name="category" value={form.category} onChange={handle}>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Date lost</label>
            <input type="date" name="date" value={form.date} onChange={handle} />
          </div>
        </div>

        <div className="form-group">
          <label>Location lost *</label>
          <input name="location" value={form.location} onChange={handle} placeholder="e.g. Kigali - Nyamirambo, near Sonatube" />
        </div>

        <div className="form-group">
          <label>Reward (RWF, optional)</label>
          <input type="number" name="reward" value={form.reward} onChange={handle} placeholder="e.g. 20000" />
        </div>

        <div className="form-group">
          <label>Image URL (optional)</label>
          <input name="image" value={form.image} onChange={handle} placeholder="https://..." />
        </div>

        <h3 style={{ marginTop: "1.25rem", marginBottom: "0.5rem" }}>Your Contact Info</h3>

        <div className="form-row">
          <div className="form-group">
            <label>Your name</label>
            <input name="contactName" value={form.contactName} onChange={handle} />
          </div>
          <div className="form-group">
            <label>Phone *</label>
            <input name="contactPhone" value={form.contactPhone} onChange={handle} placeholder="+250..." />
          </div>
        </div>

        <div className="form-group">
          <label>Email (optional)</label>
          <input type="email" name="contactEmail" value={form.contactEmail} onChange={handle} />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Posting..." : "Post Lost Item"}
          </button>
        </div>
      </form>
    </div>
  );
}