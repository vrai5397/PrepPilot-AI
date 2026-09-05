import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router";
import { useAuth } from "../../features/auth/hooks/useAuth";

const Sidebar = () => {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const onLogout = async () => {
    await handleLogout();
    navigate("/");
  };

  const toggleMobile = () => setMobileOpen((v) => !v);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const getUserInitials = () => {
    if (user?.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  const navItems = [
    { path: "/", label: "Dashboard", icon: "📊" },
    { path: "/interview-builder", label: "Interview Builder", icon: "🎯" },
    { path: "/reports", label: "Reports", icon: "📋" },
    { path: "/profile", label: "Profile", icon: "👤" },
    { path: "/settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        className="sidebar-toggle"
        onClick={toggleMobile}
        aria-label="Toggle sidebar"
      >
        <span />
        <span />
        <span />
      </button>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={toggleMobile} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="sidebar-logo-mark">PP</span>
            <span className="sidebar-logo-text">PrepPilot AI</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className="sidebar-nav-item"
              onClick={() => setMobileOpen(false)}
            >
              <span className="sidebar-nav-icon">{item.icon}</span>
              <span className="sidebar-nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            type="button"
            className="sidebar-logout"
            onClick={onLogout}
          >
            <span className="sidebar-logout-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;