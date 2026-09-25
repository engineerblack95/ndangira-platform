import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createItem } from "../api/api.js";
import { categories } from "../data/mockData.js";

export default function ReportFound() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: categories[0],
    location: "",
    date_occurred: "",
    contact_name: "",
    contact_phone: "",
    contact_email: "",
  });
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files || []).slice(0, 5); // max 5
    setFiles(selected);
    setPreviews(selected.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title || !form.description || !form.location || !form.contact_phone) {
      setError("Please fill in title, description, location, and phone.");
      return;
    }

    setSubmitting(true);
    try {
      await createItem(
        {
          type: "found",
          title: form.title,
          description: form.description,
          category: form.category,
          location: form.location,
          date_occurred: form.date_occurred || new Date().toISOString().slice(0, 10),
          contact_name: form.contact_name,
          contact_phone: form.contact_phone,
          contact_email: form.contact_email,
        },
        files
      );
      navigate("/found");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-card">
      <h2>Report a Found Item</h2>

      {error ? <div className="form-error">{error}</div> : null}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title *</label>
          <input name="title" value={form.title} onChange={handle} placeholder="e.g. Found: black iPhone" />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea name="description" value={form.description} onChange={handle} placeholder="Describe the item..." />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <select name="category" value={form.category} onChange={handle}>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Date found</label>
            <input type="date" name="date_occurred" value={form.date_occurred} onChange={handle} />
          </div>
        </div>

        <div className="form-group">
          <label>Location found *</label>
          <input name="location" value={form.location} onChange={handle} placeholder="e.g. Kigali - Kimironko" />
        </div>

        <div className="form-group">
          <label>Photos (max 5)</label>
          <input type="file" accept="image/*" multiple onChange={handleFiles} />
          {previews.length > 0 && (
            <div className="preview-grid">
              {previews.map((src, i) => (
                <img key={i} src={src} alt="" className="preview-img" />
              ))}
            </div>
          )}
        </div>

        <h3 style={{ marginTop: "1.25rem", marginBottom: "0.5rem" }}>Your Contact Info</h3>

        <div className="form-row">
          <div className="form-group">
            <label>Your name</label>
            <input name="contact_name" value={form.contact_name} onChange={handle} />
          </div>
          <div className="form-group">
            <label>Phone *</label>
            <input name="contact_phone" value={form.contact_phone} onChange={handle} placeholder="+250..." />
          </div>
        </div>

        <div className="form-group">
          <label>Email (optional)</label>
          <input type="email" name="contact_email" value={form.contact_email} onChange={handle} />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Posting..." : "Post Found Item"}
          </button>
        </div>
      </form>
    </div>
  );
}