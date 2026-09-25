import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <h4>Ndangira</h4>
          <p>Helping people find what they have lost and return what they have found.</p>
        </div>
        <div>
          <h4>Explore</h4>
          <Link to="/lost">Lost Items</Link>
          <Link to="/found">Found Items</Link>
          <Link to="/report-lost">Report Lost</Link>
          <Link to="/report-found">Report Found</Link>
        </div>
        <div>
          <h4>Account</h4>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/dashboard">Dashboard</Link>
        </div>
      </div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} Ndangira. All rights reserved.
      </div>
    </footer>
  );
}