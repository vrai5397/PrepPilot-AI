import React, { useState } from "react";
import { Link, NavLink } from "react-router";
import { useAuth } from "../../features/auth/hooks/useAuth";
import ThemeToggle from "../ThemeToggle";

const Navbar = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <header className={open ? "navbar open" : "navbar"}>
      <div className="navbar-inner">
        <Link to="/" className="brand" onClick={close}>
          <span className="brand-mark">PP</span>
          PrepPilot AI
        </Link>

        {user ? (
          <nav className="nav-links nav-desktop">
            <NavLink to="/" end>
              Dashboard
            </NavLink>
            <NavLink to="/interview-builder">
              Interview Builder
            </NavLink>
            <NavLink to="/reports">
              Reports
            </NavLink>
          </nav>
        ) : (
          <nav className="nav-links nav-desktop">
            <NavLink to="/" end>
              Home
            </NavLink>
            <a href="/#features">Features</a>
            <a href="/#how">How it works</a>
          </nav>
        )}

        <div className="nav-actions nav-desktop">
          <ThemeToggle />
          {!user && (
            <>
              <Link to="/login" className="btn btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </>
          )}
        </div>

        {!user && (
          <div className="nav-mobile-tools">
            <ThemeToggle className="theme-toggle-compact" />
            <button
              type="button"
              className="nav-toggle"
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        )}
      </div>

      <div className="nav-mobile">
        <>
          <Link to="/" onClick={close}>
            Home
          </Link>
          <a href="/#features" onClick={close}>
            Features
          </a>
          <a href="/#how" onClick={close}>
            How it works
          </a>
          <Link to="/login" className="btn btn-secondary" onClick={close}>
            Login
          </Link>
          <Link to="/register" className="btn btn-primary" onClick={close}>
            Register
          </Link>
        </>
      </div>
    </header>
  );
};

export default Navbar;
