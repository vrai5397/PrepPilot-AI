import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";
import React, { useEffect } from "react";

const Protected = ({ children }) => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="page-loader">
        <div className="page-loader-spinner" />
        <p>Loading…</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return children;
};

export default Protected;
