import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Loader from "../components/Loader.jsx";
import { getItemById } from "../api/api.js";

export default function ItemDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getItemById(id);
        setItem(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <Loader />;

  if (error || !item) {
    return (
      <div className="empty">
        <h3>Item not found</h3>
        <p>{error || "It may have been removed or the link is wrong."}</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: "1rem" }}>Back to Home</Link>
      </div>
    );
  }

  const image = item.images && item.images.length > 0 ? item.images[0] : null;

  return (
    <div className="details">
      <div>
        {image ? (
          <img src={image} alt={item.title} className="details-img" />
        ) : (
          <div className="details-img-placeholder">No image available</div>
        )}
      </div>

      <div>
        <div className="details-meta">
          <span className={`badge ${item.type === "lost" ? "badge-lost" : "badge-found"}`}>
            {item.type}
          </span>
          <span className="badge badge-category">{item.category}</span>
        </div>

        <h1>{item.title}</h1>
        <p>{item.description}</p>

        <p className="label">Location</p>
        <p>📍 {item.location}</p>

        <p className="label">Date {item.type === "lost" ? "lost" : "found"}</p>
        <p>📅 {new Date(item.date_occurred).toLocaleDateString()}</p>

        {item.reward ? (
          <>
            <p className="label">Reward</p>
            <p className="reward">RWF {Number(item.reward).toLocaleString()}</p>
          </>
        ) : null}

        <div className="contact-box">
          <h3>Contact</h3>
          <p>👤 {item.contact_name || "N/A"}</p>
          <p>📞 {item.contact_phone || "N/A"}</p>
          {item.contact_email ? <p>✉️ {item.contact_email}</p> : null}
        </div>
      </div>
    </div>
  );
}