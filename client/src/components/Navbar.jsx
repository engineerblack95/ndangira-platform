import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, signOut, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin = isLoggedIn && user?.role === "admin";

  const handleLogout = () => {
    signOut();
    setMenuOpen(false);
    navigate("/");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand" onClick={closeMenu}>
          <span className="brand-mark">N</span>
          <span className="brand-text">Ndangira</span>
        </Link>

        <button
          className="nav-toggle"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className={`nav-toggle-bar ${menuOpen ? "open" : ""}`} />
        </button>

        <div className={`nav-links ${menuOpen ? "open" : ""}`} onClick={closeMenu}>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/lost">Lost Items</NavLink>
          <NavLink to="/found">Found Items</NavLink>

          <span className="nav-divider" aria-hidden="true" />

          <NavLink to="/report-lost">Report Lost</NavLink>
          <NavLink to="/report-found">Report Found</NavLink>

          {isAdmin && (
            <>
              <span className="nav-divider" aria-hidden="true" />
              <NavLink to="/admin" className="nav-admin">
                Admin
              </NavLink>
            </>
          )}

          <div className="nav-auth-mobile">
            {isLoggedIn ? (
              <>
                <span className="nav-user">Hi, <strong>{user.name}</strong></span>
                <Link to="/dashboard" className="btn btn-outline-inverse btn-sm">Dashboard</Link>
                <button onClick={handleLogout} className="btn btn-ghost-inverse btn-sm">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost-inverse btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
              </>
            )}
          </div>
        </div>

        <div className="nav-auth nav-auth-desktop">
          {isLoggedIn ? (
            <>
              <span className="nav-user">
                Hi, <strong>{user.name}</strong>
              </span>
              <Link to="/dashboard" className="btn btn-outline-inverse btn-sm">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn btn-ghost-inverse btn-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost-inverse btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}