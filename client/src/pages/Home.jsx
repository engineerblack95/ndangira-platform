import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ItemGrid from "../components/ItemGrid.jsx";
import Loader from "../components/Loader.jsx";
import { getItems } from "../api/api.js";

export default function Home() {
  const [lost, setLost] = useState([]);
  const [found, setFound] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("lost");

  useEffect(() => {
    (async () => {
      try {
        const [l, f] = await Promise.all([
          getItems({ type: "lost" }),
          getItems({ type: "found" }),
        ]);
        setLost(l);
        setFound(f);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalItems = lost.length + found.length;
  const shown = tab === "lost" ? lost.slice(0, 3) : found.slice(0, 3);

  return (
    <div>
      {/* ============ HERO ============ */}
      <section className="hero hero-pro">
        <span className="hero-badge">Ndangira Platform</span>
        <h1>Lost something? Found something?</h1>
        <p>
          Ndangira connects people who lost items with those who found them —
          quick, free, and community-driven.
        </p>
        <div className="hero-actions">
          <Link to="/report-lost" className="btn btn-primary btn-lg">
            Report a Lost Item
          </Link>
          <Link to="/report-found" className="btn btn-outline btn-lg">
            Report a Found Item
          </Link>
        </div>

        <div className="hero-trust">
          <span>📍 Rwanda</span>
          <span>•</span>
          <span>Free forever</span>
          <span>•</span>
          <span>Community powered</span>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="stats">
        <div className="stat">
          <div className="stat-value">{totalItems}+</div>
          <div className="stat-label">Items Posted</div>
        </div>
        <div className="stat">
          <div className="stat-value">{found.length}</div>
          <div className="stat-label">Found Reports</div>
        </div>
        <div className="stat">
          <div className="stat-value">{lost.length}</div>
          <div className="stat-label">Lost Reports</div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="how-it-works">
        <div className="step">
          <div className="step-num">1</div>
          <h3>Post your item</h3>
          <p>Describe it, add photos, and mention where and when it was lost or found.</p>
        </div>
        <div className="step">
          <div className="step-num">2</div>
          <h3>Search & match</h3>
          <p>Browse lost and found listings to find a match.</p>
        </div>
        <div className="step">
          <div className="step-num">3</div>
          <h3>Reconnect</h3>
          <p>Contact the person and return the item. Everyone wins.</p>
        </div>
      </section>

      {/* ============ RECENT ITEMS (with tab switcher) ============ */}
      <div className="section-header section-header-tabs">
        <div className="home-tabs">
          <button
            className={`home-tab ${tab === "lost" ? "active" : ""}`}
            onClick={() => setTab("lost")}
          >
            Recent Lost ({lost.length})
          </button>
          <button
            className={`home-tab ${tab === "found" ? "active" : ""}`}
            onClick={() => setTab("found")}
          >
            Recent Found ({found.length})
          </button>
        </div>
        <Link to={tab === "lost" ? "/lost" : "/found"}>View all →</Link>
      </div>

      {error && <div className="form-error">{error}</div>}

      {loading ? (
        <Loader />
      ) : shown.length === 0 ? (
        <div className="empty">
          <h3>No {tab} items yet</h3>
          <p>Be the first to post one.</p>
          <Link
            to={tab === "lost" ? "/report-lost" : "/report-found"}
            className="btn btn-primary"
            style={{ marginTop: "1rem" }}
          >
            Post {tab === "lost" ? "Lost" : "Found"} Item
          </Link>
        </div>
      ) : (
        <ItemGrid items={shown} />
      )}

      {/* ============ CTA STRIP ============ */}
      <section className="home-cta">
        <div>
          <h2>Have something to report?</h2>
          <p>It takes less than a minute. Free, no signup needed to browse.</p>
        </div>
        <div className="home-cta-actions">
          <Link to="/report-lost" className="btn btn-primary">Report Lost</Link>
          <Link to="/report-found" className="btn btn-outline">Report Found</Link>
        </div>
      </section>
    </div>
  );
}