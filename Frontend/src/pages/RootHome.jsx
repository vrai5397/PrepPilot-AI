import React from "react";
import { useAuth } from "../features/auth/hooks/useAuth";
import Landing from "../features/landing/Landing";
import Home from "../features/interview/pages/Home";

const RootHome = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="page-loader">
        <div className="page-loader-spinner" />
        <p>Loading…</p>
      </div>
    );
  }

  if (!user) {
    return <Landing />;
  }

  return <Home />;
};

export default RootHome;
