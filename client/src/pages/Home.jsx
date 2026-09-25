import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ItemGrid from "../components/ItemGrid.jsx";
import Loader from "../components/Loader.jsx";
import { getItems } from "../api/api.js";

export default function Home() {
  const [lost, setLost] = useState([]);
  const [found, setFound] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [l, f] = await Promise.all([
        getItems({ type: "lost" }),
        getItems({ type: "found" }),
      ]);
      setLost(l.slice(0, 3));
      setFound(f.slice(0, 3));
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      <section className="hero">
        <h1>Lost something? Found something?</h1>
        <p>Ndangira connects people who lost items with those who found them.</p>
        <div className="hero-actions">
          <Link to="/report-lost" className="btn btn-primary btn-lg">Report a Lost Item</Link>
          <Link to="/report-found" className="btn btn-outline btn-lg">Report a Found Item</Link>
        </div>
      </section>

      <section className="stats">
        <div className="stat">
          <div className="stat-value">{lost.length + found.length}+</div>
          <div className="stat-label">Items Posted</div>
        </div>
        <div className="stat">
          <div className="stat-value">100%</div>
          <div className="stat-label">Free to Use</div>
        </div>
        <div className="stat">
          <div className="stat-value">24/7</div>
          <div className="stat-label">Available</div>
        </div>
      </section>

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

      <div className="section-header">
        <h2>Recent Lost Items</h2>
        <Link to="/lost">View all →</Link>
      </div>
      {loading ? <Loader /> : <ItemGrid items={lost} />}

      <div className="section-header" style={{ marginTop: "2.5rem" }}>
        <h2>Recent Found Items</h2>
        <Link to="/found">View all →</Link>
      </div>
      {loading ? <Loader /> : <ItemGrid items={found} />}
    </div>
  );
}