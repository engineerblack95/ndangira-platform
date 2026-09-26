import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Loader from "../components/Loader.jsx";
import { getItemById } from "../api/api.js";

export default function ItemDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [copied, setCopied] = useState(false);

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

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: item.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      /* user cancelled */
    }
  };

  if (loading) return <Loader />;

  if (error || !item) {
    return (
      <div className="empty">
        <h3>Item not found</h3>
        <p>{error || "It may have been removed or the link is wrong."}</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: "1rem" }}>
          Back to Home
        </Link>
      </div>
    );
  }

  const images = item.images && item.images.length > 0 ? item.images : [];
  const hasImages = images.length > 0;
  const dateLabel = item.type === "lost" ? "Date lost" : "Date found";

  return (
    <div className="details-page">
      <Link to={item.type === "lost" ? "/lost" : "/found"} className="back-link">
        ← Back to {item.type} items
      </Link>

      <div className="details-grid">
        {/* ---- LEFT: Image gallery ---- */}
        <div className="details-media">
          {hasImages ? (
            <>
              <div className="details-hero-img-wrap">
                <img
                  src={images[activeImage]}
                  alt={item.title}
                  className="details-hero-img"
                />
              </div>

              {images.length > 1 && (
                <div className="thumb-strip">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`thumb-btn ${i === activeImage ? "active" : ""}`}
                      onClick={() => setActiveImage(i)}
                    >
                      <img src={src} alt={`${item.title} ${i + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="details-img-placeholder">No image available</div>
          )}
        </div>

        {/* ---- RIGHT: Info panel ---- */}
        <div className="details-info">
          <div className="details-meta">
            <span className={`badge ${item.type === "lost" ? "badge-lost" : "badge-found"}`}>
              {item.type}
            </span>
            <span className="badge badge-category">{item.category}</span>
            {item.status && item.status !== "open" && (
              <span className="badge badge-found">{item.status}</span>
            )}
          </div>

          <h1 className="details-title">{item.title}</h1>

          <p className="details-desc">{item.description}</p>

          <div className="details-facts">
            <div className="fact">
              <span className="fact-icon">📍</span>
              <div>
                <div className="fact-label">Location</div>
                <div className="fact-value">{item.location}</div>
              </div>
            </div>

            <div className="fact">
              <span className="fact-icon">📅</span>
              <div>
                <div className="fact-label">{dateLabel}</div>
                <div className="fact-value">
                  {new Date(item.date_occurred).toLocaleDateString()}
                </div>
              </div>
            </div>

            {item.reward ? (
              <div className="fact">
                <span className="fact-icon">💰</span>
                <div>
                  <div className="fact-label">Reward</div>
                  <div className="fact-value reward">
                    RWF {Number(item.reward).toLocaleString()}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="contact-box">
            <h3>Contact the reporter</h3>
            <p>
              <span className="contact-icon">👤</span>
              {item.contact_name || "N/A"}
            </p>
            {item.contact_phone && (
              <p>
                <span className="contact-icon">📞</span>
                <a href={`tel:${item.contact_phone}`}>{item.contact_phone}</a>
              </p>
            )}
            {item.contact_email && (
              <p>
                <span className="contact-icon">✉️</span>
                <a href={`mailto:${item.contact_email}`}>{item.contact_email}</a>
              </p>
            )}

            <div className="contact-actions">
              {item.contact_phone && (
                <a href={`tel:${item.contact_phone}`} className="btn btn-primary btn-sm">
                  Call
                </a>
              )}
              {item.contact_email && (
                <a href={`mailto:${item.contact_email}`} className="btn btn-outline btn-sm">
                  Email
                </a>
              )}
              <button type="button" className="btn btn-ghost btn-sm" onClick={handleShare}>
                {copied ? "Link copied ✓" : "Share"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}