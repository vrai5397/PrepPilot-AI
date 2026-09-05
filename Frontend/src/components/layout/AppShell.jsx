import React from "react";
import { Outlet, useLocation } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { useAuth } from "../../features/auth/hooks/useAuth";

const AppShell = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Check if current route is a public/auth page
  const isPublicRoute = ['/login', '/register', '/forgot-password', '/reset-password'].some(path => 
    location.pathname.startsWith(path)
  );

  // Show sidebar for authenticated users on protected routes
  const showSidebar = user && !isPublicRoute;

  // Show navbar for public routes or when not authenticated
  const showNavbar = !user || isPublicRoute;

  // Show footer only on public routes
  const showFooter = !user || isPublicRoute;

  return (
    <div className={`app-shell ${showSidebar ? 'app-shell-with-sidebar' : ''}`}>
      {showNavbar && <Navbar />}
      {showSidebar && <Sidebar />}
      <div className={`app-shell-main ${showSidebar ? 'app-shell-main-with-sidebar' : ''}`}>
        <Outlet />
      </div>
      {showFooter && <Footer />}
    </div>
  );
};

export default AppShell;
