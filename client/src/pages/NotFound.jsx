import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="empty">
      <h3 style={{ fontSize: "2.5rem" }}>404</h3>
      <h3>Page not found</h3>
      <p>The page you're looking for does not exist.</p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: "1rem" }}>Go Home</Link>
    </div>
  );
}